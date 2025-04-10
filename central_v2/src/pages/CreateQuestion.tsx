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
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { updateDQwithImage, updateDQwithImageURL, updateDQwithTitle, updateDQwithCCSS, updateDQwithQuestionClick, base64ToFile, fileToBase64 } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import { updateDQwithCorrectAnswer, updateDQwithCorrectAnswerSteps, updateDQwithCorrectAnswerClick } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { getNextHighlightCard, handleMoveAnswerToComplete, updateDQwithIncorrectAnswerClick, updateDQwithIncorrectAnswers, handleIncorrectCardClick } from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import ErrorCard from '../components/cards/ErrorCard';

type TitleTextProps = {
  screenSize: ScreenSize;
}

const TitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<TitleTextProps>(({ theme, screenSize }) => ({
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
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [highlightCard, setHighlightCard] = useState<CreateQuestionHighlightCard>(CreateQuestionHighlightCard.QUESTIONCARD);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const [isMultipleChoice, setIsMultipleChoice] = useState<boolean>(true);
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
  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    if (inputImage) {
      const newDraftQuestion = updateDQwithImage(draftQuestion, undefined, inputImage);
      setDraftQuestion(newDraftQuestion);
    } else if (inputUrl) {
      const newDraftQuestion = updateDQwithImageURL(draftQuestion, inputUrl);
      setDraftQuestion(newDraftQuestion);
    }
  }

  const handleAnswerType = () => {
    setIsMultipleChoice(!isMultipleChoice);
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
      const newDraftQuestion = updateDQwithImageURL(draftQuestion, inputUrl);
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
    setIsImageUploadVisible(true);
  }

  const handlePublicPrivateChange = (value: PublicPrivateType) => {
    setPublicPrivate((prev) => value);
  }

  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsCreatingTemplate(false);
    setIsCCSSVisible(false);
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
            url = await apiClients.questionTemplate.storeImageUrlInS3(draftQuestion.questionCard.imageUrl);
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

  const handleSaveDraftQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      setIsCreatingTemplate(true);
      let result = null;
      let url = '';
      if (draftQuestion.questionCard.image){
        const img = await apiClients.questionTemplate.storeImageInS3(draftQuestion.questionCard.image) 
        // have to do a nested await here because aws-storage returns a nested promise object
        result = await img.result;
        if (result && result.path && result.path.length > 0)
          url = result.path;
      } else if (draftQuestion.questionCard.imageUrl){
        url = await apiClients.questionTemplate.storeImageUrlInS3(draftQuestion.questionCard.imageUrl);
      }
      window.localStorage.setItem(StorageKey, '');
      apiClients.questionTemplate.createQuestionTemplate(PublicPrivateType.DRAFT, url, draftQuestion);
      setIsCreatingTemplate(false);
      navigate('/questions');
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
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible || isCreatingTemplate || isCCSSVisible} handleCloseModal={handleCloseModal}/>
       <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisible}
          handleCCSSSubmit={handleCCSSSubmit}
        />
       <ImageUploadModal 
          draftQuestion={draftQuestion} 
          screenSize={screenSize}  
          isModalOpen={isImageUploadVisible} 
          handleImageChange={handleImageChange}
          handleImageSave={handleImageSave} 
          handleCloseModal={handleCloseModal}
        />
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
      <TitleText screenSize={ScreenSize.LARGE}>Create Question</TitleText>
      { (screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) &&
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
            <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-Start', alignItems: 'center', gap: `${theme.sizing.xSmPadding}px`, paddingRight: '30px'}}>
              <CentralButton buttonType={ButtonType.SAVE} isEnabled onClick={handleSaveQuestion} />
              <CentralButton buttonType={ButtonType.SAVEDRAFT} isEnabled smallScreenOverride onClick={handleSaveDraftQuestion} />
              <CentralButton buttonType={ButtonType.DISCARDBLUE} isEnabled onClick={handleDiscardQuestion} />
            </Box>
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
            minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
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
              handlePublicPrivateChange={handlePublicPrivateChange}
              isCardSubmitted={isCardSubmitted}
              isCardErrored={isCardErrored}
              isAIError={isAIError}
              isPublic={publicPrivate === PublicPrivateType.PUBLIC}
              isMultipleChoice={isMultipleChoice}
              handleAnswerType={handleAnswerType}
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