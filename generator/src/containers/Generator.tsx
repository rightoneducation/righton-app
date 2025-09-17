import React, {useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Switch, Radio, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper';
import { Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import { generateWrongAnswerExplanations, evalTextComplexity, regenerateWrongAnswerExplanation, createExplanation, saveDiscardedExplanation, getDiscardedExplanations } from '../lib/API';
import { IQuestion, IExplanationToSave, IDiscardedExplanationToSave, IDiscardedExplanationSaveInput, ILocalExplanation } from '../lib/Models';
import QuestionSavedModal from '../components/modals/QuestionSavedModal';
import HowToModal from '../components/modals/HowToModal';
import ModalBackground from '../components/modals/ModalBackground';
import { QuestionInfoContainer } from '../components/QuestionInfoContainer';
import { ExplanationCards } from '../components/ExplanationCards';
import { version, date, model, ExplanationRegenType } from '../lib/Constants';
import { MainContainer, TextContainer, HeaderContainer, HeaderRightContainer, CardsContainer, QuestionContainer, FooterContainer, HeaderButtonContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { HeaderText } from '../lib/styledcomponents/generator/StyledTypography';
import { ButtonSaveStyled, ButtonSecondaryStyled } from '../lib/styledcomponents/generator/StyledButtons';
import { ScreenSize } from '../lib/Models';
import RightonLogo from '../img/RightonLogo.svg';
import howtouse from '../img/icons/howtouse.svg';
import saved from '../img/icons/saved.svg';
import generator from '../img/icons/generator.svg';
import 'swiper/css';
import 'swiper/css/pagination';
import SavedExplanationCard from '../components/SavedExplanationCard';

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
  const [formData, setFormData] = React.useState<IQuestion>({
    question: '',
    correctAnswer: '',
    wrongAnswers: [''],
    discardedExplanations: [],
    version
  });
  const [explanationsToSave, setExplanationsToSave] = React.useState<IExplanationToSave[]>([]);
  const [isFormComplete, setIsFormComplete] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const [isQuestionGenerating, setIsQuestionGenerating] = React.useState(false);
  const [isExplanationRegenerating, setIsExplanationRegenerating] = React.useState(false);
  const [regenIndex, setRegenIndex] = React.useState<number | null>(null);
  const [isQuestionGenerated, setIsQuestionGenerated] = React.useState(false);
  const [isQuestionSaved, setIsQuestionSaved] = React.useState(false);
  const [isCustomQuestion, setIsCustomQuestion] = React.useState(true);
  const [isHowToModalOpen, setIsHowToModalOpen] = React.useState(false);
  const [isSavedExplanation, setIsSavedExplanation] = React.useState(false);
  const [savedExplanations, setSavedExplanations] = React.useState<ILocalExplanation[]>([]);
  const [selectedSampleQuestion, setSelectedSampleQuestion] = React.useState(0);
  const blankQuestion = {
    question: '',
    correctAnswer: '',
    wrongAnswers: [],
    discardedExplanations: [],
    version
  }
  //const [wrongAnswerExplanations, setWrongAnswerExplanations] = React.useState<string[]>([]);
  const [question, setQuestion] = React.useState<IQuestion>(blankQuestion);
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
      wrongAnswers: ['50%'],
      discardedExplanations: [],
      version
    },
    {
      question: "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      correctAnswer: "25", 
      wrongAnswers: ['10'],
      discardedExplanations: [],
      version
    },
    {
      question: "If f(x) = x^2 + 2x + 3, what is the value of f(x), when x = 6?",
      correctAnswer: "51", 
      wrongAnswers: ['27'],
      discardedExplanations: [],
      version
    }
  ]

  useEffect(() => {
    const formComplete = Object.values(formData).every(val => 
      {
        if (Array.isArray(val)){
          return val.every((item) => item.trim() !== '');
        }
        return val.trim() !== ''
      }
    );
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

  const labelText = ['Question', 'Correct Answer'];
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index?: number) => {
    setIsQuestionSaved(false);
    const { name, value } = event.target;
    if (index !== undefined){
      setFormData((prev) => {
        const updatedArray = [...prev.wrongAnswers];
        updatedArray[index] = value;
        return {
          ...prev,
          wrongAnswers: updatedArray
        }
      });
    }
    else
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuestion = () => {
    setIsQuestionGenerating(true);
    handleChangeSlide();
    generateWrongAnswerExplanations(formData, discardedExplanations).then((response) => {
      const explanationsArray = response ?? [];
      const explanations =  explanationsArray.map((explanation: string, index: number) => {
        return (
          {
            question: formData.question,
            correctAnswer: formData.correctAnswer,
            wrongAnswer: formData.wrongAnswers[index],
            genExplanation: {
              explanation,
            },
            discardedExplanations: [],
            version
          }
        )
      });

      setExplanationsToSave(explanations);
      setIsQuestionGenerating(false);
      setIsQuestionGenerated(true);
      setIsSubmitted(true);
    });
  };

  const handleSaveExplanation = (explanation: IExplanationToSave) => {
    createExplanation(explanation)
  };

  const handleNavigateToSavedExplanations = () => {
    setIsSavedExplanation(true);
    const localExplanations = localStorage.getItem('righton_saved_explanations');
    if (localExplanations){
      setSavedExplanations(JSON.parse(localExplanations));
    };
  };
  const handleNavigateToGenerator = () => {
    setIsSavedExplanation(false);
  };

  const handleAddWrongAnswer = () => {
    if (formData.wrongAnswers.length > 3) return;
    setFormData((prev) => ({
      ...prev,
      wrongAnswers: [...prev.wrongAnswers, '']
    }));
  };

  const handleDiscardSavedExplanation = (explanation: IExplanationToSave) => {
    const updatedExplanations = savedExplanations.filter((savedExplanation) => savedExplanation.genExplanation.explanation !== explanation.genExplanation.explanation);
    setSavedExplanations(updatedExplanations);
    localStorage.setItem('righton_saved_explanations', JSON.stringify(updatedExplanations));
  }

  const handleUpdateExplanations= (explanation: IExplanationToSave, index: number) => {
    setExplanationsToSave((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = explanation;
      return updatedArray;
    });
  }

  const handleGenerateSample = () => {
    setIsHowToModalOpen(false);
    const randomQuestionIndex = Math.floor(Math.random() * sampleQuestions.length);
    setIsCustomQuestion(false);
    setFormData(sampleQuestions[randomQuestionIndex])
  };

  const handleCloseModal = () => {
    setIsHowToModalOpen(false);
  };

  return (
    <MainContainer>
      <QuestionSavedModal isModalOpen={isQuestionSaved} />
      <HowToModal isModalOpen={isHowToModalOpen} setIsHowToModalOpen={setIsHowToModalOpen} handleGenerateSample={handleGenerateSample}/>
      <ModalBackground isModalOpen={isHowToModalOpen} handleCloseModal={handleCloseModal} />
      <HeaderContainer>
        <img src={RightonLogo} alt="Righton Logo"style={{height: '55px', width: 'fit-content'}}/>
        <HeaderRightContainer>
          <HeaderButtonContainer onClick={() => setIsHowToModalOpen(true)} >
            <img src={howtouse} alt="How to use icon"/>
            { screenSize !== ScreenSize.SMALL && 
              <HeaderText>How To Use</HeaderText>
            }
          </HeaderButtonContainer>
          { !isSavedExplanation ? 
            <HeaderButtonContainer onClick={() => handleNavigateToSavedExplanations()}>
              <img src={saved} alt="Save icon"/>
              { screenSize !== ScreenSize.SMALL && 
                <HeaderText>Saved Explanations</HeaderText>
              }
            </HeaderButtonContainer>
          : 
            <HeaderButtonContainer onClick={() => handleNavigateToGenerator()}>
              <img src={generator} alt="Save icon"/>
              { screenSize !== ScreenSize.SMALL && 
                <HeaderText>Generator</HeaderText>
              }
            </HeaderButtonContainer>
          }
        </HeaderRightContainer>
      </HeaderContainer>
      { isSavedExplanation ? (
        <>
          <TextContainer>
            <Typography style={{ fontFamily: 'Poppins', textAlign: 'center', fontWeight: 700, fontSize: '40px', lineHeight: '40px',  color: 'white'}} >
              Saved Explanations
            </Typography>
          </TextContainer>
          <CardsContainer container columnSpacing={'20px'}>
            <Grid item xs={12} style={{paddingTop: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: '8px'}}>
              { savedExplanations.length > 0 && savedExplanations.map((explanation, index) => {
                  return <SavedExplanationCard explanation={explanation} handleDiscardSavedExplanation={handleDiscardSavedExplanation} key={index}/>
                })
              }
            </Grid>
          </CardsContainer>
        </>
        )
      : (
        <>
      <TextContainer>
          <Typography style={{ fontFamily: 'Poppins', textAlign: 'center', fontWeight: 700, fontSize: '40px', lineHeight: '40px',  color: 'white'}} >
            Wrong Answer Explanation Generator
          </Typography>
          <Typography style={{ fontFamily: 'Rubik',textAlign: 'center', fontSize: '16px', lineHeight: '16px',  color: 'white'}} >
            AI-Powered Insights to Guide Student Understanding
          </Typography>
        </TextContainer>
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
              <QuestionInfoContainer 
                isCustomQuestion={isCustomQuestion}
                labelText={labelText}
                handleInputChange={handleInputChange}
                formData={formData}
                isSubmitted={isSubmitted}
                isFormComplete={isFormComplete}
                isQuestionGenerating={isQuestionGenerating}
                handleSubmitQuestion={handleSubmitQuestion}
                handleAddWrongAnswer={handleAddWrongAnswer}
              />
            </SwiperSlide>
            <SwiperSlide key="explanation-slide">
              <ExplanationCards
                screenSize={screenSize}
                explanationsToSave={explanationsToSave}
                handleUpdateExplanations={handleUpdateExplanations}
                isQuestionGenerating={isQuestionGenerating}
                isExplanationRegenerating={isExplanationRegenerating}
                regenIndex={regenIndex}
              />
            </SwiperSlide>
          </Swiper>
        : <CardsContainer container columnSpacing={'20px'}>
            <Grid item xs={6} style={{paddingTop: 0, height: 'fit-content'}}>
              <QuestionInfoContainer 
                isCustomQuestion={isCustomQuestion}
                labelText={labelText}
                handleInputChange={handleInputChange}
                formData={formData}
                isSubmitted={isSubmitted}
                isFormComplete={isFormComplete}
                isQuestionGenerating={isQuestionGenerating}
                handleSubmitQuestion={handleSubmitQuestion}
                handleAddWrongAnswer={handleAddWrongAnswer}
              />
            </Grid>
            <Grid item xs={6} style={{paddingTop: 0, height: '100%'}}>
              <ExplanationCards
                screenSize={screenSize}
                explanationsToSave={explanationsToSave}
                handleUpdateExplanations={handleUpdateExplanations}
                isQuestionGenerating={isQuestionGenerating}
                isExplanationRegenerating={isExplanationRegenerating}
                regenIndex={regenIndex}
              />
            </Grid>
          </CardsContainer>
        }
      </>
      )
    }
    </MainContainer>
  );
}