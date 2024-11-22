import React, { useState, useCallback } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import DebugAuth from '../components/debug/DebugAuth';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { CreateQuestionTemplateInput, ScreenSize, BorderStyle, CreateQuestionHighlightCard, IncorrectAnswer } from '../lib/CentralModels';
import CentralButton from '../components/button/Button';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import { ButtonType } from '../components/button/ButtonModels';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import CCSSTabsModalBackground from '../components/ccsstabs/CCSSTabsModalBackground';
import IncorrectAnswerCardStack from '../components/cards/createquestion/stackedcards/IncorrectAnswerCardStack';
import ModalBackground from '../components/modal/ModalBackground';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import ImageURLModal from '../components/modal/ImageURLModal';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';

type TitleTextProps = {
  screenSize: ScreenSize;
}

const TitleText = styled(Typography)<TitleTextProps>(({ theme, screenSize }) => ({
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize:
    screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
}));

const SubCardGridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const AISwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    background: theme.palette.primary.aiGradient,
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#111111",
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111',
  },
}));

interface CreateQuestionProps {
  screenSize: ScreenSize;
}

export default function CreateQuestion({
  screenSize
}:CreateQuestionProps){
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState<boolean>(false);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [ccss, setCCSS] = useState<string>('CCSS');
  const [highlightCard, setHighlightCard] = useState<CreateQuestionHighlightCard>(CreateQuestionHighlightCard.QUESTIONCARD);
  const [isQuestionCardComplete, setIsQuestionCardComplete] = useState<boolean>(false);
  const [isCorrectCardComplete, setIsCorrectCardComplete] = useState<boolean>(false);
  const [draftQuestion, setDraftQuestion] = useState<CreateQuestionTemplateInput>({
    title: '',
    image: null,
    correctAnswer: '',
    correctAnswerSteps: [],
    incorrectAnswers: [
      {answer: '', explanation: ''},
      {answer: '', explanation: ''},
      {answer: '', explanation: ''},
    ],
    ccss: 'CCSS'
  });
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);

  // question card functions
  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  };
  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  }

  const handleImageURLClick = () => {
    setIsImageURLVisible(true);
  }

  const handleImageSave = (inputImage: File) => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    if (inputImage){
      setDraftQuestion((prev) => ({...prev, image: inputImage}));
      if (draftQuestion.ccss.length > 0 && draftQuestion.ccss !== 'CCSS' && draftQuestion.title){
        setIsQuestionCardComplete(true);
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
      }
    }
  }

  const handleDebouncedTitleChange = useCallback( // eslint-disable-line
    debounce((title: string, draftQuestionInput: CreateQuestionTemplateInput) => {
      setDraftQuestion((prev) => ({...prev, title}));
      // we're doing this circular passing of draftQuestion here to avoid stale state
      if (draftQuestionInput.ccss.length > 0 && draftQuestionInput.ccss !== 'CCSS' && draftQuestionInput.image){
        setIsQuestionCardComplete(true);
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
      }
    }, 1000),
    [] 
  )

  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
  }

  const handleCCSSSubmit = (ccssString: string) => {
    setDraftQuestion((prev) => ({...prev, ccss: ccssString}));
    setIsCCSSVisible(false);
    if (ccssString && draftQuestion.image && draftQuestion.title){
      setIsQuestionCardComplete(true);
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    }
  };

  const verifyQuestionCard = () => {
    if (!draftQuestion.image || !draftQuestion.ccss || !draftQuestion.title)
      return false;
    return true;
  };

  // correct answer card functions
  const handleDebouncedCorrectAnswerChange = useCallback( // eslint-disable-line
    debounce((correctAnswer: string, draftQuestionInput: CreateQuestionTemplateInput) => {
      setDraftQuestion((prev) => ({...prev, correctAnswer}));
      if (draftQuestionInput.incorrectAnswers.every((answer) => answer.answer.length > 0) && correctAnswer.length > 0){
        setIsCorrectCardComplete(true);
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
      }
    }, 1000),
    [] 
  )
  
  const handleDebouncedCorrectAnswerStepsChange = useCallback( // eslint-disable-line
    debounce((steps: string[], draftQuestionInput: CreateQuestionTemplateInput) => {
      setDraftQuestion((prev) => ({...prev, correctAnswerSteps: steps}));
      if (draftQuestionInput.correctAnswer.length > 0 && steps.every((step) => step.length > 0)){
        setIsCorrectCardComplete(true);
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
      }
    }, 1000),
    [] 
  )

  // incorrect answer card functions
  const handleDraftQuestionIncorrectUpdate = (newAnswers: IncorrectAnswer[]) => {
    console.log(newAnswers);
    setDraftQuestion((prev) => ({...prev, incorrectAnswers: newAnswers}));
  }

  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    console.log(draftQuestion);
    if ((cardType === CreateQuestionHighlightCard.QUESTIONCARD && isQuestionCardComplete)
      || (cardType === CreateQuestionHighlightCard.CORRECTANSWER && isCorrectCardComplete)
      || (cardType === CreateQuestionHighlightCard.INCORRECTANSWER1 && draftQuestion.incorrectAnswers[0].answer.length > 0 && draftQuestion.incorrectAnswers[0].explanation.length > 0)
      || (cardType === CreateQuestionHighlightCard.INCORRECTANSWER2 && draftQuestion.incorrectAnswers[1].answer.length > 0 && draftQuestion.incorrectAnswers[1].explanation.length > 0)
      || (cardType === CreateQuestionHighlightCard.INCORRECTANSWER3 && draftQuestion.incorrectAnswers[2].answer.length > 0 && draftQuestion.incorrectAnswers[2].explanation.length > 0)) 
      return;
    setHighlightCard(cardType);
  };

  const handleBackToExplore = () => {
    setIsCCSSVisible(false);
  };

  const handleSaveQuestion = () => {
    try {
      const isQuestionVerified = verifyQuestionCard();
      setIsCardSubmitted(true);
      if (draftQuestion.image && isQuestionVerified) {
        apiClients.questionTemplate.storeImageInS3(draftQuestion.image);
        navigate('/questions');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleDiscardQuestion = () => {
    navigate('/questions');
  }

  return (
    <CreateQuestionMainContainer>
       
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible} handleCloseModal={handleCloseModal}/>
       <ImageUploadModal screenSize={screenSize} isModalOpen={isImageUploadVisible} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} borderStyle={BorderStyle.SVG}/>
       <ImageURLModal isModalOpen={isImageURLVisible} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} />
      <>
        <CCSSTabsModalBackground
          isTabsOpen={isCCSSVisible}
          handleBackToExplore={handleBackToExplore}
        />
        <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisible}
          handleCCSSSubmit={handleCCSSSubmit}
        />
      </>
      <TitleText screenSize={ScreenSize.LARGE}>Create Question</TitleText>
      <CreateQuestionGridContainer container >
        { (screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) &&
            <Box style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingBottom: '16px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride onClick={handleSaveQuestion} />
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled smallScreenOverride onClick={handleDiscardQuestion} />
            </Box>
          }
        <Grid
          sm
          md
          item
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: '16px'}}
        >
          { (screenSize !== ScreenSize.SMALL && screenSize !== ScreenSize.MEDIUM) &&
            <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingRight: '30px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled onClick={handleSaveQuestion} />
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled onClick={handleDiscardQuestion} />
            </Box>
          }
        </Grid>
        <Grid
          sm={12}
          item
          style={{
            width: '100%',
            maxWidth: '672px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.smPadding}px`,
          }}
        >
          <Box onClick={() => handleClick(CreateQuestionHighlightCard.QUESTIONCARD)} style={{ width: '100%' }}>
            <CreateQuestionCardBase
              screenSize={screenSize}
              draftQuestion={draftQuestion}
              handleTitleChange={handleDebouncedTitleChange}
              handleCCSSClick={handleCCSSClick}
              isHighlight={highlightCard === CreateQuestionHighlightCard.QUESTIONCARD}
              handleImageUploadClick={handleImageUploadClick}
              handleImageURLClick={handleImageURLClick}
              isCardSubmitted={isCardSubmitted}
              isCardComplete={isQuestionCardComplete}
            />
          </Box>
          <Grid
            container
            spacing={`${theme.sizing.smPadding}px`}
          >
            <SubCardGridItem 
              item
              sm={12}
              md={6}
            >
              <Box onClick={() => handleClick(CreateQuestionHighlightCard.CORRECTANSWER)} style={{ width: '100%' }}>
                <CorrectAnswerCard
                  draftQuestion={draftQuestion} 
                  isCardSubmitted={isCardSubmitted}
                  isHighlight={highlightCard === CreateQuestionHighlightCard.CORRECTANSWER}
                  handleCorrectAnswerChange={handleDebouncedCorrectAnswerChange}
                  handleCorrectAnswerStepsChange={handleDebouncedCorrectAnswerStepsChange}
                />
              </Box>
            </SubCardGridItem>
            <SubCardGridItem
              item
              sm={12}
              md={6}
            >
              <Box style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                <Typography style={{textAlign: 'right', fontWeight: 500}}>
                  Try our AI-Generated Wrong Answer Explanation Prototype
                </Typography>
                <AISwitch/>
              </Box>
                <IncorrectAnswerCardStack highlightCard={highlightCard} draftQuestion={draftQuestion} handleDraftQuestionIncorrectUpdate={handleDraftQuestionIncorrectUpdate} handleCardClick={handleClick} isCardSubmitted={isCardSubmitted}/>
            </SubCardGridItem>
          </Grid>
        </Grid>
        <Grid sm md item />
      </CreateQuestionGridContainer>
    </CreateQuestionMainContainer>
  );
}