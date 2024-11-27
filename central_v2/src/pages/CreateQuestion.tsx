import React, { useState, useCallback } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { debounce, set, update } from 'lodash';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
  QuestionCard,
  IncorrectCard,
} from '@righton/networking';
import DebugAuth from '../components/debug/DebugAuth';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { 
  ScreenSize,
  BorderStyle,
  CreateQuestionHighlightCard,
  StorageKey
} from '../lib/CentralModels';
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
import { updateDQwithImage, updateDQwithImageChange, updateDQwithTitle, updateDQwithCCSS } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';

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
  const [highlightCard, setHighlightCard] = useState<CreateQuestionHighlightCard>(CreateQuestionHighlightCard.QUESTIONCARD);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);

  const retrieveStorage = () => {
    const storageObject = window.localStorage.getItem(StorageKey);
    if (storageObject){
      return JSON.parse(storageObject);
    }
    return null;
  }

  const [draftQuestion, setDraftQuestion] = useState<CentralQuestionTemplateInput>(() => {
    return {
        questionCard: {
          title: '',
          ccss: 'CCSS',
          image: null,
          imageUrl: null,
          isFirstEdit: true,
          isCardComplete: false,
        },
        correctCard: {
          answer: '',
          answerSteps: ['','',''],
          isFirstEdit: true,
          isCardComplete: false,
        },
        incorrectCards: [
          {
            id: 'card-1',
            answer: '', 
            explanation: '',
            isFirstEdit: true,
            isCardComplete: false,
          },
          {
            id: 'card-2',
            answer: '', 
            explanation: '',
            isFirstEdit: true,
            isCardComplete: false,
          },
          {
            id: 'card-3',
            answer: '', 
            explanation: '',
            isFirstEdit: true,
            isCardComplete: false,
          },
        ]
      }
    }
  );
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);
  const [isCardErrored, setIsCardErrored] = useState<boolean>(false);

  // CreateQuestionCardBase handler functions
  const handleImageChange = (inputImage: File, inputUrl: string | null) => {
    if (inputImage){
      const newDraftQuestion = updateDQwithImageChange(draftQuestion, inputImage, inputUrl);
      setDraftQuestion(newDraftQuestion);
    }
  }

  const handleImageUrlChange = useCallback( // eslint-disable-line
    debounce((debouncedQuestion: CentralQuestionTemplateInput, url: string) => {
      const newDraftQuestion = updateDQwithImageChange(debouncedQuestion, null, url);
      setDraftQuestion(newDraftQuestion);
      console.log(newDraftQuestion);
    }, 500),
    [] 
  )

  const handleImageSave = (inputImage: File | null, inputUrl: string | null) => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    if (inputImage){
      const { isFirstEdit } = draftQuestion.questionCard;
      const newDraftQuestion = updateDQwithImage(draftQuestion, inputImage, inputUrl);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      console.log(newDraftQuestion);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    }
  }

  const handleDebouncedTitleChange = useCallback( // eslint-disable-line
    debounce((title: string, draftQuestionInput: CentralQuestionTemplateInput) => {
      const { isFirstEdit } = draftQuestionInput.questionCard;
      const newDraftQuestion = updateDQwithTitle(draftQuestionInput, title);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      console.log(newDraftQuestion);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    }, 1000),
    [] 
  )

  const handleCCSSSubmit = (ccssString: string) => {
    setIsCCSSVisible(false);
    const { isFirstEdit } = draftQuestion.questionCard;
    const newDraftQuestion = updateDQwithCCSS(draftQuestion, ccssString);
    window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
    setDraftQuestion(newDraftQuestion);
    console.log(newDraftQuestion);
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  };


  // question card functions
  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  }

  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  }

  const handleImageURLClick = () => {
    setIsImageURLVisible(true);
  }

  const handlePublicPrivateChange = (value: PublicPrivateType) => {
    setPublicPrivate((prev) => value);
  }

  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
  }

  // correct answer card functions
  const handleDebouncedCorrectAnswerChange = useCallback( // eslint-disable-line
    debounce((correctAnswer: string, draftQuestionInput: CentralQuestionTemplateInput) => {
      if (draftQuestionInput.correctCard.answerSteps.length > 0 && draftQuestionInput.correctCard.answerSteps.every((answer) => answer.length > 0) && correctAnswer.length > 0){
        if (draftQuestionInput.incorrectCards[0].isFirstEdit){
          setDraftQuestion((prev) => {
            const updatedQuestion = {...prev, correctCard: { ...prev.correctCard, answer: correctAnswer, isCardComplete: true, isFirstEdit: false}};
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return {...prev, updatedQuestion}
          });
          setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
        } else {
          setDraftQuestion((prev) => {
            const updatedQuestion = {...prev, correctCard: { ...prev.correctCard, answer: correctAnswer, isCardComplete: true}};
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return {...prev, updatedQuestion}
          });
        }
      }
      setDraftQuestion((prev) => {
        const updatedQuestion = {...prev, correctCard: { ...prev.correctCard, answer: correctAnswer }};
        window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
        return {...prev, updatedQuestion}
      });
    }, 1000),
    [] 
  )
  
  const handleDebouncedCorrectAnswerStepsChange = useCallback( // eslint-disable-line
    debounce((steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
      if (draftQuestionInput.correctCard.answer.length > 0 && steps.length > 0 && steps.every((step) => step.length > 0)){
        if (draftQuestionInput.incorrectCards[0].isFirstEdit){
          setDraftQuestion((prev) => {
            const updatedQuestion = {...prev, correctCard: { ...prev.correctCard, answerSteps: steps, isCardComplete: true, isFirstEdit: false}};
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return {...prev, updatedQuestion}
          });
          setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
        } else {
          setDraftQuestion((prev) => {
            const updatedQuestion = {...prev, correctCard: { ...prev.correctCard, answerSteps: steps, isCardComplete: true }};
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return {...prev, updatedQuestion}
          });
        }
      }
      setDraftQuestion((prev) => {
        const updatedQuestion = {...prev, correctCard: { ...prev.correctCard, answerSteps: steps}};
        window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
        return {...prev, updatedQuestion}
      });
    }, 1000),
    [] 
  )

  // incorrect answer card functions
  const getNextHighlightCard =(currentId: CreateQuestionHighlightCard): CreateQuestionHighlightCard | null  => {
    const values = Object.values(CreateQuestionHighlightCard);
    const currentIndex = values.indexOf(currentId);
    if (currentIndex === -1 || currentIndex === values.length - 1) {
      return null; // No next value or current is the last
    }
    return values[currentIndex + 1] as CreateQuestionHighlightCard;
  }

  const handleDraftQuestionIncorrectUpdate = (newAnswers: IncorrectCard[], cardData: IncorrectCard) => {
      const nextCard = getNextHighlightCard(cardData.id as CreateQuestionHighlightCard);
      const updatedCard = {...cardData, isCardComplete: true, isFirstEdit: false};
      const updatedAnswers = newAnswers.map((answer) => { 
        if (answer.id === cardData.id) {
          return updatedCard;
        }
        return answer;
      });
      setDraftQuestion((prev) => {
        const updatedQuestion = {...prev, incorrectCards: [...updatedAnswers]};
        window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
        return {...prev, updatedQuestion}
      });
      if (cardData.isFirstEdit)
        setHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
  }
  
  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    switch(cardType){
      case CreateQuestionHighlightCard.CORRECTANSWER:
        if (draftQuestion.correctCard.isCardComplete){
          setDraftQuestion((prev) => {
            const updatedQuestion = ({...prev, correctCard: {...prev.correctCard, isCardComplete: false}})
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return updatedQuestion;
          });
        }
        break;
      case CreateQuestionHighlightCard.INCORRECTANSWER1:{
        const newAnswers = [...draftQuestion.incorrectCards];
        const incorrectCard = newAnswers.find((card) => card.id === 'card-1');
        if (incorrectCard && incorrectCard.isCardComplete){
          incorrectCard.isCardComplete = false;
          const updatedAnswers = newAnswers.map((answer) => {
            if (answer.id === 'card-1') {
              return incorrectCard;
            }
            return answer;
          });
          setDraftQuestion((prev) => {
            const updatedQuestion = ({...prev, incorrectCards: updatedAnswers})
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return updatedQuestion;
          });
        }
        break;
      }
      case CreateQuestionHighlightCard.INCORRECTANSWER2: {
        const newAnswers = [...draftQuestion.incorrectCards];
        const incorrectCard = newAnswers.find((card) => card.id === 'card-2');
        if (incorrectCard && incorrectCard.isCardComplete){
          incorrectCard.isCardComplete = false;
          const updatedAnswers = newAnswers.map((answer) => {
            if (answer.id === 'card-2') {
              return incorrectCard;
            }
            return answer;
          });
          setDraftQuestion((prev) => {
            const updatedQuestion = ({...prev, incorrectCards: updatedAnswers});
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return updatedQuestion;
          });
        }
        break;
      }
      case CreateQuestionHighlightCard.INCORRECTANSWER3:{
        const newAnswers = [...draftQuestion.incorrectCards];
        const incorrectCard = newAnswers.find((card) => card.id === 'card-3');
        if (incorrectCard && incorrectCard.isCardComplete){
          incorrectCard.isCardComplete = false;
          const updatedAnswers = newAnswers.map((answer) => {
            if (answer.id === 'card-3') {
              return incorrectCard;
            }
            return answer;
          });
          setDraftQuestion((prev) => {
            const updatedQuestion = ({...prev, incorrectCards: updatedAnswers});
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return updatedQuestion;
        });
        }
        break;
      }
      case CreateQuestionHighlightCard.QUESTIONCARD:
      default:
        if (draftQuestion.questionCard.isCardComplete){
          setDraftQuestion((prev) => {
            const updatedQuestion = ({...prev, questionCard: {...prev.questionCard, isCardComplete: false}})
            window.localStorage.setItem(StorageKey, JSON.stringify(updatedQuestion));
            return updatedQuestion;
          });
        }
        break;
    }
  };

  const handleBackToExplore = () => {
    setIsCCSSVisible(false);
  };

  const verifyCorrectCard = (correctCard: CentralQuestionTemplateInput['correctCard']): boolean => {
    if (
      correctCard.answer 
      && correctCard.answer.length > 0 
      && correctCard.answerSteps.length > 0 
      && correctCard.answerSteps.every((step) => step.length > 0
    )){
      return true;
    }
    return false;
  };

  const verifyIncorrectCards = (incorrectCards: CentralQuestionTemplateInput['incorrectCards']): boolean => {
    if (incorrectCards.every((card) => card.answer.length > 0 && card.explanation.length > 0)){
      return true;
    }
    return false;
  };

  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      if (draftQuestion.questionCard.isCardComplete && verifyCorrectCard(draftQuestion.correctCard) && verifyIncorrectCards(draftQuestion.incorrectCards)){
        if (draftQuestion.questionCard.image) {
          const img = await apiClients.questionTemplate.storeImageInS3(draftQuestion.questionCard.image);
          // have to do a nested await here because aws-storage returns a nested promise object
          const result = await img.result;
          if (result && result.path && result.path.length > 0){
            window.localStorage.setItem(StorageKey, '');
            const url = result.path;
            apiClients.questionTemplate.createQuestionTemplate(publicPrivate, url, draftQuestion);
          }
          // navigate('/questions');
        }
      } else {
        setIsCardErrored(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleDiscardQuestion = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  }

  return (
    <CreateQuestionMainContainer>
       <DebugAuth />
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible} handleCloseModal={handleCloseModal}/>
       <ImageUploadModal draftQuestion={draftQuestion} handleImageChange={handleImageChange} screenSize={screenSize} isModalOpen={isImageUploadVisible} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} borderStyle={BorderStyle.SVG}/>
       <ImageURLModal draftQuestion={draftQuestion} isModalOpen={isImageURLVisible} handleImageUrlChange={handleImageUrlChange} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} />
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
              handlePublicPrivateChange={handlePublicPrivateChange}
              isCardSubmitted={isCardSubmitted}
              isCardErrored={isCardErrored}
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
                  isHighlight={highlightCard === CreateQuestionHighlightCard.CORRECTANSWER}
                  handleCorrectAnswerChange={handleDebouncedCorrectAnswerChange}
                  handleCorrectAnswerStepsChange={handleDebouncedCorrectAnswerStepsChange}
                  isCardSubmitted={isCardSubmitted}
                  isCardErrored={isCardErrored}
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
          
            </SubCardGridItem>
          </Grid>
        </Grid>
        <Grid sm md item />
      </CreateQuestionGridContainer>
    </CreateQuestionMainContainer>
  );
}