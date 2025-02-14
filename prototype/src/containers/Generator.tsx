import React, {useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Switch, Radio, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper';
import { Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import { generateWrongAnswerExplanations, regenerateWrongAnswerExplanation, createQuestion, saveDiscardedExplanation, getDiscardedExplanations } from '../lib/API';
import { IDiscardedExplanationToSave, IQuestionToSave, IRegenInput } from '../lib/Models';
import QuestionSavedModal from '../components/modals/QuestionSavedModal';
import ModalBackground from '../components/modals/ModalBackground';
import { QuestionCard } from '../components/QuestionCard';
import ButtonSubmitQuestion from '../components/ButtonSubmitQuestion';
import { ExplanationCards } from '../components/ExplanationCards';
import { version, date, model, ExplanationRegenType } from '../lib/Constants';
import InfoIcon from '../img/InfoIcon.svg';
import OpenAI from '../img/OpenAILogo.svg';
import { MainContainer, HeaderContainer, VersionContainer, CardsContainer, QuestionContainer, FooterContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { TooltipStyled } from '../lib/styledcomponents/generator/StyledTooltip';
import { ButtonSaveStyled, ButtonSecondaryStyled } from '../lib/styledcomponents/generator/StyledButtons';
import { ScreenSize } from '../lib/Models';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Generator() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const handleChangeSlide=()=>{
    if (swiper)
      swiper.slideTo(1, 750);
  }
  const [formData, setFormData] = React.useState({
    question: '',
    correctAnswer: '',
    wrongAnswer1: '',
    wrongAnswer2: '',
    wrongAnswer3: '',
  });
  const [isFormComplete, setIsFormComplete] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const [isQuestionGenerating, setIsQuestionGenerating] = React.useState(false);
  const [isExplanationRegenerating, setIsExplanationRegenerating] = React.useState(false);
  const [regenIndex, setRegenIndex] = React.useState<number | null>(null);
  const [isQuestionGenerated, setIsQuestionGenerated] = React.useState(false);
  const [isQuestionSaved, setIsQuestionSaved] = React.useState(false);
  const [isCustomQuestion, setIsCustomQuestion] = React.useState(true);
  const [selectedSampleQuestion, setSelectedSampleQuestion] = React.useState(0);
  const blankQuestion = {
    question: '',
    correctAnswer: '',
    wrongAnswers: [],
    discardedExplanations: [],
    version
  }
  //const [wrongAnswerExplanations, setWrongAnswerExplanations] = React.useState<string[]>([]);
  const [questionToSave, setQuestionToSave] = React.useState<IQuestionToSave>(blankQuestion);
  const [discardedExplanations, setDiscardedExplanations] = React.useState<IDiscardedExplanationToSave[]>([]);
  
  const wrongAnswerExplanations = [
    'This is the wrong answer explanation for wrong answer 1',
    'This is the wrong answer explanation for wrong answer 2',
    'This is the wrong answer explanation for wrong answer 3',
  ];
  const [selectedCards, setSelectedCards] = React.useState(new Array(wrongAnswerExplanations.length).fill(false));

  const sampleQuestions = [
    {
      question: "A pair of shoes were 10% off last week. This week, there’s an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that you’d get if you buy the shoes this week?",
      correctAnswer: "46%", 
      wrongAnswer1: "50%",
      wrongAnswer2: "54%",
      wrongAnswer3: "14%"
    },
    {
      question: "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      correctAnswer: "25", 
      wrongAnswer1: "10",
      wrongAnswer2: "20",
      wrongAnswer3: "13.75"
    },
    {
      question: "If f(x) = x^2 + 2x + 3, what is the value of f(x), when x = 6?",
      correctAnswer: "51", 
      wrongAnswer1: "27",
      wrongAnswer2: "41",
      wrongAnswer3: "65"
    }
  ]

  useEffect(() => {
    const formComplete = Object.values(formData).every(val => val.trim() !== '');
    setIsFormComplete(formComplete);
  }, [formData]);

  useEffect(()=>{
    const selected = selectedCards.some((isSelected) => isSelected);
    setIsSelected(selected);
  }, [selectedCards])

  useEffect(() => {
    const fetchDiscardedExplanations = async () => {
      const explanations = await getDiscardedExplanations(10);
      setDiscardedExplanations(explanations);
    };
  
    fetchDiscardedExplanations();
  }, []);

  const labelText = ['Question', 'Correct Answer', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'];
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsQuestionSaved(false);
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuestion = () => {
    setIsQuestionGenerating(true);
    generateWrongAnswerExplanations(formData, discardedExplanations).then((response) => {
      const explanationsArray = response ?? [];
      const wrongAnswersArray =  explanationsArray.map((explanation: string, index: number) => {
        const adjustedIndex = index + 1;
        const answerKey = `wrongAnswer${adjustedIndex}` as keyof typeof formData;
        return (
          {
            answer: formData[answerKey],
            selectedExplanation: explanation,
            dismissedExplanations: [],
          }
        )
      });

      setQuestionToSave((prev) => ({
        ...prev,
        question: formData.question,
        correctAnswer: formData.correctAnswer,
        wrongAnswers: wrongAnswersArray,
        discardedExplanations: [],
        version
      }));
      handleChangeSlide();
      setIsQuestionGenerating(false);
      setIsQuestionGenerated(true);
      setIsSubmitted(true);
    });
  };

  const handleSaveQuestion = () => {
    createQuestion(questionToSave).then((response) => {
      setQuestionToSave(blankQuestion);
      setFormData({
        question: '',
        correctAnswer: '',
        wrongAnswer1: '',
        wrongAnswer2: '',
        wrongAnswer3: '',
      });
      setQuestionToSave(blankQuestion);
      setIsSubmitted(false);
      setIsSelected(false);
      setIsQuestionSaved(true);
      setIsQuestionGenerated(false);
      if (swiper)
        swiper.slideTo(0, 750);
    });
  };

  const handleDiscardQuestion = () => {
    setFormData({
      question: '',
      correctAnswer: '',
      wrongAnswer1: '',
      wrongAnswer2: '',
      wrongAnswer3: '',
    });
    setQuestionToSave(blankQuestion);
    setIsSubmitted(false);
    setIsSelected(false);
    setIsQuestionSaved(false);
    setIsQuestionGenerated(false);
    if (swiper)
      swiper.slideTo(0, 750);
  }

  const handleExplanationClick = (input: IRegenInput) => {
    // Toggle the selected state for the clicked card
    setSelectedCards((current) =>
      current.map((isSelected, idx) => (input.index === idx ? !isSelected : isSelected))
    );
    const fullInput = {
      ...input,
      discardedExplanations
    }
    switch (input.action){
      case (ExplanationRegenType.ACCEPT):
        console.log("accepted");
        break;
      case (ExplanationRegenType.DISCARD):
        console.log("discard");
        break;
      case (ExplanationRegenType.REGEN): 
        setIsExplanationRegenerating(true);
        setRegenIndex(input.index);
        if (input){
          regenerateWrongAnswerExplanation(fullInput).then((response: any) => {
            const newExplanation = response.content;
            const oldExplanation = questionToSave.wrongAnswers[input.index ?? 0].selectedExplanation;
            setQuestionToSave((prev) => {
              const updatedWrongAnswers = [...prev.wrongAnswers];
              updatedWrongAnswers[input.index ?? 0].selectedExplanation = newExplanation;
              return {
                ...prev,
                wrongAnswers: updatedWrongAnswers,
              };
            })
            console.log(newExplanation);
            setSelectedCards((current) =>
              current.map((isSelected, idx) => (input.index === idx ? !isSelected : isSelected))
            );
            setIsExplanationRegenerating(false);
          }
        );
      }
      break;
    }
  };

  const saveDiscardExplanation = (question: string, discardedExplanation: string) => {
    const discardedQuestionInput: IDiscardedExplanationToSave = {
      question,
      explanation: discardedExplanation,
      discardText: "Math is incorrect",
      version
    }
    const result = saveDiscardedExplanation(discardedQuestionInput);
  }

  const handleGenerateSampleQuestion = () => {
    const randomQuestionIndex = Math.floor(Math.random() * sampleQuestions.length);
    setIsCustomQuestion(false);
    setFormData(sampleQuestions[randomQuestionIndex])
  };

  const handleCloseModal = () => {
    setIsQuestionSaved(false);
  };

  return (
    <MainContainer>
      <QuestionSavedModal isModalOpen={isQuestionSaved} />
      <ModalBackground isModalOpen={isQuestionSaved} handleCloseModal={handleCloseModal} />
      <VersionContainer>
        <TooltipStyled 
          title={
            <>
              <Typography style={{  fontFamily: 'Montserrat',  fontSize: '12px', color: 'white', textAlign: 'right'}} >
              Version {version}
              </Typography>
              <Typography style={{  fontFamily: 'Montserrat',  fontSize: '12px', color: 'white', textAlign: 'right'}} >
              Last updated: {date}
              </Typography>
              <Typography style={{   fontFamily: 'Montserrat', fontSize: '12px', color: 'white', textAlign: 'right'}} >
              Model: {model}
              </Typography>
            </>
          }
          arrow
          placement="top"
        >
          <img src={InfoIcon} alt="Version Info" />
        </TooltipStyled>
      </VersionContainer>
      <HeaderContainer>
        <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px'}} >
          <Typography style={{ fontFamily: 'Rubik', fontSize: '16px', lineHeight: '16px', color: 'white'}} >
            Powered By:
          </Typography>
          <img src={OpenAI} alt="OpenAI Logo"/>
        </Box>
        <Typography style={{ fontFamily: 'Poppins', textAlign: 'center', fontWeight: 700, fontSize: '40px', lineHeight: '40px',  color: 'white'}} >
          Wrong Answer Explanations
        </Typography>
        <Typography style={{ fontFamily: 'Rubik',textAlign: 'center', fontSize: '16px', lineHeight: '16px',  color: 'white'}} >
          AI-Powered Insights to Guide Student Understanding
        </Typography>
      </HeaderContainer>
      { screenSize === ScreenSize.SMALL 
      ? <Swiper
          onSwiper={(swiper: any) => {
            setSwiper(swiper)
          }}
          style={{
            width: '100vw',
            paddingLeft: `${theme.sizing.mdPadding}px`,
            paddingRight: `${theme.sizing.mdPadding}px`,
            boxSizing: 'border-box'
          }}
          modules={[Pagination]}
          pagination={{
            el: '.swiper-pagination-container',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            clickable: true,
            renderBullet(index: number, className: string) {
              return `<span class="${className}" style="width:20px; height:6px; border-radius:2px;"></span>`;
            },
          }}
          centeredSlides
          slidesPerView={1}
          spaceBetween={`${theme.sizing.mdPadding}px`}
          updateOnWindowResize
        >
          <SwiperSlide key="question-slide">
            <QuestionCard 
              isCustomQuestion={isCustomQuestion}
              labelText={labelText}
              handleInputChange={handleInputChange}
              formData={formData}
              isSubmitted={isSubmitted}
              isFormComplete={isFormComplete}
              isQuestionGenerating={isQuestionGenerating}
              handleSubmitQuestion={handleSubmitQuestion}
              handleGenerateSampleQuestion={handleGenerateSampleQuestion}
            />
          </SwiperSlide>
          <SwiperSlide key="explanation-slide">
            <ExplanationCards
              isSubmitted={isSubmitted}
              questionToSave={questionToSave}
              selectedCards={selectedCards}
              setQuestionToSave={setQuestionToSave}
              handleExplanationClick={handleExplanationClick}
              saveDiscardExplanation={saveDiscardExplanation}
              isQuestionSaved={isQuestionSaved}
              isQuestionGenerating={isQuestionGenerating}
              isExplanationRegenerating={isExplanationRegenerating}
              regenIndex={regenIndex}
            />
          </SwiperSlide>
        </Swiper>
      : <CardsContainer container columnSpacing={'20px'}>
          <Grid item xs={6} style={{paddingTop: 0}}>
            <QuestionCard 
              isCustomQuestion={isCustomQuestion}
              labelText={labelText}
              handleInputChange={handleInputChange}
              formData={formData}
              isSubmitted={isSubmitted}
              isFormComplete={isFormComplete}
              isQuestionGenerating={isQuestionGenerating}
              handleSubmitQuestion={handleSubmitQuestion}
              handleGenerateSampleQuestion={handleGenerateSampleQuestion}
            />
          </Grid>
          <Grid item xs={6} style={{paddingTop: 0}}>
            <ExplanationCards
              isSubmitted={isSubmitted}
              questionToSave={questionToSave}
              selectedCards={selectedCards}
              setQuestionToSave={setQuestionToSave}
              handleExplanationClick={handleExplanationClick}
              saveDiscardExplanation={saveDiscardExplanation}
              isQuestionSaved={isQuestionSaved}
              isQuestionGenerating={isQuestionGenerating}
              isExplanationRegenerating={isExplanationRegenerating}
              regenIndex={regenIndex}
            />
          </Grid>
        </CardsContainer>
      }
      { isQuestionGenerated &&
        <FooterContainer screenSize={screenSize}>
          <ButtonSaveStyled style={{width: '220px'}} onClick={handleSaveQuestion}>
            Save Question
          </ButtonSaveStyled>
          <ButtonSecondaryStyled style={{width: '220px'}} onClick={handleDiscardQuestion}>
            Discard Question
          </ButtonSecondaryStyled>
        </FooterContainer>
      }
    </MainContainer>
  );
}