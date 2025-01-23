import React, { useState, useCallback } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled, Fade} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
  IncorrectCard,
} from '@righton/networking';
import useCreateQuestionLoader from '../loaders/useCreateQuestionLoader';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionBackground, CreateQuestionGridContainer, CreateQuestionMainContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { 
  ScreenSize,
  BorderStyle,
  CreateQuestionHighlightCard,
  StorageKey,
  TemplateType
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
import { updateDQwithImage, updateDQwithImageChange, updateDQwithTitle, updateDQwithCCSS, updateDQwithQuestionClick, base64ToFile, fileToBase64 } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import { updateDQwithCorrectAnswer, updateDQwithCorrectAnswerSteps, updateDQwithCorrectAnswerClick } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { getNextHighlightCard, handleMoveAnswerToComplete, updateDQwithIncorrectAnswerClick, updateDQwithIncorrectAnswers, handleIncorrectCardClick } from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import ErrorCard from '../components/cards/ErrorCard';

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
  paddingTop: `${theme.sizing.lgPadding}px`,
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
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [highlightCard, setHighlightCard] = useState<CreateQuestionHighlightCard>(CreateQuestionHighlightCard.QUESTIONCARD);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const localData = useCreateQuestionLoader();
  
  const [incompleteIncorrectAnswers, setIncompleteIncorrectAnswers] = useState<IncorrectCard[]>( 
    localData.incompleteCards ??
    [
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
  );
  const [completeIncorrectAnswers, setCompleteIncorrectAnswers] = useState<IncorrectCard[]>(
    localData.completeCards ??
    []
  );

  const [draftQuestion, setDraftQuestion] = useState<CentralQuestionTemplateInput>(() => {
    return  localData.draftQuestion ?? {
        questionCard: {
          title: '',
          ccss: 'CCSS',
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
          ...incompleteIncorrectAnswers, 
          ...completeIncorrectAnswers
        ]
      }
    }
  );
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);
  const [isCardErrored, setIsCardErrored] = useState<boolean>(false);
  const [isAIError, setIsAIError] = useState<boolean>(false);
  // QuestionCardBase handler functions
  const [modalImage, setModalImage] = useState<File | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [debouncedModalImageUrl, setDebouncedModalImageUrl] = useState<string | null>(null);

  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    if (inputImage)
      setModalImage(inputImage);
  }

  const handledebouncedImageUrlChange = useCallback( // eslint-disable-line
    debounce((debouncedQuestion: CentralQuestionTemplateInput, url: string) => {
      setDebouncedModalImageUrl(url);
    }, 500),
    [] 
  )

  const handleImageUrlChange = (inputQuestion: CentralQuestionTemplateInput, url: string) => {
    setModalImageUrl(url);
    handledebouncedImageUrlChange(inputQuestion, url);
  }
  
  const handleImageSave = async (
    inputImage?: File, 
    inputUrl?: string
  ) => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    if (inputImage){
      const { isFirstEdit } = draftQuestion.questionCard;
      const newDraftQuestion = updateDQwithImage(draftQuestion, undefined, inputImage);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    }
    if (inputUrl){
      const { isFirstEdit } = draftQuestion.questionCard;
      const newDraftQuestion = updateDQwithImage(draftQuestion, inputUrl);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
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
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  };

  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  }

  const handleImageUploadClick = () => {
    setModalImageUrl(null);
    setIsImageUploadVisible(true);
  }

  const handleImageURLClick = () => {
    setModalImage(null);
    setIsImageURLVisible(true);
  }

  const handlePublicPrivateChange = (value: PublicPrivateType) => {
    setPublicPrivate((prev) => value);
  }

  const handleCloseModal = () => {
    setModalImage(null);
    setModalImageUrl(null);
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsCreatingTemplate(false);
  }

  // CorrectAnswerCard handler functions
  const handleDebouncedCorrectAnswerChange = useCallback( // eslint-disable-line
    debounce((correctAnswer: string, draftQuestionInput: CentralQuestionTemplateInput) => {
      const { isFirstEdit } = draftQuestionInput.correctCard;
      const newDraftQuestion = updateDQwithCorrectAnswer(draftQuestionInput, correctAnswer);
      console.log(newDraftQuestion);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
    }, 1000),
    [] 
  )
  
  const handleDebouncedCorrectAnswerStepsChange = useCallback( // eslint-disable-line
    debounce((steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
      const { isFirstEdit } = draftQuestionInput.correctCard;
      const newDraftQuestion = updateDQwithCorrectAnswerSteps(draftQuestionInput, steps);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
    }, 1000),
    [] 
  )

  // incorrect answer card functions
  const handleNextCardButtonClick = (cardData: IncorrectCard) => {
    if (isAIError)
      setIsAIError(false);
    const updatedAnswers = incompleteIncorrectAnswers.map((answer) => {
      if (answer.id === cardData.id) {
        return cardData;
      }
      return answer;
    });
    const { newIncompleteAnswers, newCompleteAnswers } = handleMoveAnswerToComplete(updatedAnswers, completeIncorrectAnswers);
    setIncompleteIncorrectAnswers(newIncompleteAnswers);
    setCompleteIncorrectAnswers(newCompleteAnswers);
  };

  const handleIncorrectCardStackUpdate = (cardData: IncorrectCard, draftQuestionInput: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[], isAIEnabledCard?: boolean) => {
      const nextCard = getNextHighlightCard(cardData.id as CreateQuestionHighlightCard);
      const isUpdateInIncompleteCards = incompleteAnswers.find(answer => answer.id === cardData.id);
      let newDraftQuestion = null;
      const isCardComplete = cardData.answer.length >0 && cardData.explanation.length > 0;
      // we need to break this up so we don't change the stateful arrays when a card is not being passed across them. 
      // everytime we update those arrays, we're going to trigger an animation, so we have to only manipulate them when we want that
      // so in this case, if the card that is being edited is already complete, we are only going to update the draftQuestion object and leave the arrays alone
      if (isUpdateInIncompleteCards){
        setIsAIError(false);
        const updatedAnswers = incompleteAnswers.map((answer) => {
          if (answer.id === cardData.id) {
            return cardData;
          }
          return answer;
        });
        if (isCardComplete && !isAIEnabledCard){
          // adjust incomplete and complete arrays, moving completed card over
          const { newIncompleteAnswers, newCompleteAnswers } = handleMoveAnswerToComplete(updatedAnswers, completeAnswers);
          // adjust local state for the cards so that they animate properly through the stack
          setIncompleteIncorrectAnswers(newIncompleteAnswers);
          setCompleteIncorrectAnswers(newCompleteAnswers);
          newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, newIncompleteAnswers, newCompleteAnswers);

          if (cardData.isFirstEdit)
            setHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
        } else {
          newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, updatedAnswers, completeAnswers);
        }
      } else {
        const newCompleteAnswers = completeAnswers.map((answer) => {
          if (answer.id === cardData.id) {
            return cardData;
          }
          return answer;
        })
        newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, incompleteAnswers, newCompleteAnswers);
      }
    
      // adjust draftQuestion and localstorage for use in API call and retrieval, respectively
      if (newDraftQuestion){
        setDraftQuestion(newDraftQuestion);
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      }
   
  }
  
  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    switch(cardType){
      case CreateQuestionHighlightCard.CORRECTANSWER:
        if (draftQuestion.correctCard.isCardComplete){
          const newDraftQuestion = updateDQwithCorrectAnswerClick(draftQuestion);
          window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
          setDraftQuestion(newDraftQuestion);
        }
        break;
      case CreateQuestionHighlightCard.INCORRECTANSWER1:
      case CreateQuestionHighlightCard.INCORRECTANSWER2:
      case CreateQuestionHighlightCard.INCORRECTANSWER3:
      {
        // then we can update the draftQuestion for the api call and the localStorage for retreival, respectively
        const newDraftQuestion = updateDQwithIncorrectAnswerClick(draftQuestion, cardType);
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
        setDraftQuestion(newDraftQuestion);
        break;
      }
      case CreateQuestionHighlightCard.QUESTIONCARD:
      default:
        if (draftQuestion.questionCard.isCardComplete){
          const newDraftQuestion = updateDQwithQuestionClick(draftQuestion);
          window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
          setDraftQuestion(newDraftQuestion);
        }
        break;
    }
  };

  const handleBackToExplore = () => {
    setIsCCSSVisible(false);
  };
  // TODO: implement to save question on imageurl
  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      if (draftQuestion.questionCard.isCardComplete && draftQuestion.correctCard.isCardComplete && draftQuestion.incorrectCards.every((card) => card.isCardComplete)){
        if (draftQuestion.questionCard.image || draftQuestion.questionCard.imageUrl){
          setIsCreatingTemplate(true);
          let result = null;
          let url = null;
          if (draftQuestion.questionCard.image){
            const img = await apiClients.questionTemplate.storeImageInS3(draftQuestion.questionCard.image) 
            // have to do a nested await here because aws-storage returns a nested promise object
            result = await img.result;
            if (result && result.path && result.path.length > 0)
              url = result.path;
          } else if (draftQuestion.questionCard.imageUrl){
            console.log('here');
            url = await apiClients.questionTemplate.storeImageUrlInS3(draftQuestion.questionCard.imageUrl);
            console.log('url');
          }
          window.localStorage.setItem(StorageKey, '');
          console.log(draftQuestion.questionCard.imageUrl);
          if (url){
            apiClients.questionTemplate.createQuestionTemplate(publicPrivate, url, draftQuestion);
          }
          setIsCreatingTemplate(false);
          navigate('/questions');
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

  const handleAIError = () => {
    setIsAIError(true);
  }

  const handleAIIsEnabled = () => {
    setIsAIEnabled((prev) => !prev);
    setIsAIError(false);
  }

  return (
    <CreateQuestionMainContainer>
      <CreateQuestionBackground />
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible || isCreatingTemplate} handleCloseModal={handleCloseModal}/>
       <ImageUploadModal modalImage={modalImage} draftQuestion={draftQuestion} handleImageChange={handleImageChange} screenSize={screenSize} isModalOpen={isImageUploadVisible} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} borderStyle={BorderStyle.SVG}/>
       <ImageURLModal modalImageUrl={modalImageUrl} debouncedModalImageUrl={debouncedModalImageUrl} draftQuestion={draftQuestion} isModalOpen={isImageURLVisible} handleImageUrlChange={handleImageUrlChange} handleImageSave={handleImageSave} handleCloseModal={handleCloseModal} />
       <CreatingTemplateModal isModalOpen={isCreatingTemplate} templateType={TemplateType.QUESTION}/>
       <Box style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: `${theme.sizing.lgPadding}px`,
          zIndex: 1,
          position: 'relative',
          paddingLeft: `${theme.sizing.mdPadding}px`,
          paddingRight: `${theme.sizing.mdPadding}px`,
          boxSizing: 'border-box',
        }}>
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
      { (screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) &&
            <>
              <Fade 
                in={isCardErrored}
                mountOnEnter
                unmountOnExit
                timeout={500}
              >
                <div>
                  <ErrorCard />
                </div>
              </Fade>  
              <Box style={{
                width: '100%', 
                maxWidth: '672px',
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: `${theme.sizing.xSmPadding}px`, 
                paddingBottom: '16px',
              }}>
                <CentralButton buttonType={ButtonType.SAVE} isEnabled smallScreenOverride onClick={handleSaveQuestion} />
                <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled smallScreenOverride onClick={handleDiscardQuestion} />
              </Box>
            </>
          }
      <CreateQuestionGridContainer container  wrap="nowrap" >
        <Grid
          sm
          md={1}
          lg={4}
          item
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: '16px', gap: '20px'}}
        >
          { (screenSize !== ScreenSize.SMALL && screenSize !== ScreenSize.MEDIUM) &&
            <>
              <Fade 
                in={isCardErrored}
                mountOnEnter
                unmountOnExit
                timeout={500}
              >
                <div>
                  <ErrorCard />
                </div>
              </Fade>  
            <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingRight: '30px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled onClick={handleSaveQuestion} />
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled onClick={handleDiscardQuestion} />
            </Box>
            </>
          }
        </Grid>
        <Grid
          sm={12}
          md={10}
          lg={4}
          item
          style={{
            width: '100%',
            maxWidth: '672px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.xLgPadding}px`,
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
              isAIError={isAIError}
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
                  isAIError={isAIError}
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
                <AISwitch checked={isAIEnabled} onChange={(prev) => handleAIIsEnabled()}/>
              </Box>
              <IncorrectAnswerCardStack 
                draftQuestion={draftQuestion}
                completeIncorrectAnswers={completeIncorrectAnswers}
                incompleteIncorrectAnswers={incompleteIncorrectAnswers}
                highlightCard={highlightCard} 
                handleNextCardButtonClick={handleNextCardButtonClick}
                handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
                handleCardClick={handleClick} 
                handleAIError={handleAIError}
                isCardSubmitted={isCardSubmitted}
                isAIEnabled={isAIEnabled}
                isAIError={isAIError}
              />
            </SubCardGridItem>
          </Grid>
        </Grid>
        <Grid  
          sm
          md={1}
          lg={4} item />
      </CreateQuestionGridContainer>
      </Box>
    </CreateQuestionMainContainer>
  );
}