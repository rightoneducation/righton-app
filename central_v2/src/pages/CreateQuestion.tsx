import React, { useState, useCallback, useEffect } from 'react';
import {Grid, Typography, Box, Switch, useTheme, styled, CircularProgress, Fade} from '@mui/material';
import { useNavigate, useMatch } from 'react-router-dom';
import { debounce, set } from 'lodash';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
  IncorrectCard,
  AnswerType,
  AnswerPrecision
} from '@righton/networking';
import useCreateQuestionLoader from '../loaders/useCreateQuestionLoader';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase'
import { CreateQuestionBackground, CreateQuestionGridContainer, CreateQuestionMainContainer, CreateQuestionBoxContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import { 
  ScreenSize,
  BorderStyle,
  CreateQuestionHighlightCard,
  StorageKey,
  TemplateType,
  GameQuestionType
} from '../lib/CentralModels';
import CentralButton from '../components/button/Button';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import { ButtonType } from '../components/button/ButtonModels';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import CCSSTabsModalBackground from '../components/ccsstabs/CCSSTabsModalBackground';
import IncorrectAnswerCardStack from '../components/cards/createquestion/stackedcards/IncorrectAnswerCardStack';
import ModalBackground from '../components/modal/ModalBackground';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import DiscardModal from '../components/modal/DiscardModal';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { updateDQwithImage, updateDQwithImageURL, updateDQwithTitle, updateDQwithCCSS, updateDQwithQuestionClick, base64ToFile, fileToBase64 } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import { updateDQwithCorrectAnswer, updateDQwithCorrectAnswerSteps, updateDQwithCorrectAnswerClick, updateDQwithAnswerSettings } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { getNextHighlightCard, handleMoveAnswerToComplete, updateDQwithIncorrectAnswerClick, updateDQwithIncorrectAnswers, handleIncorrectCardClick } from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';
import { assembleQuestionTemplate } from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import { AISwitch } from '../lib/styledcomponents/AISwitchStyledComponent';

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

interface CreateQuestionProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: () => void;
}

export default function CreateQuestion({
  screenSize,
  fetchElement,
  fetchElements
}:CreateQuestionProps){
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const route = useMatch('/clone/question/:questionId');
  const isClone = route?.params.questionId !== null && route?.params.questionId !== undefined && route?.params.questionId.length > 0;
  const [isCloneImageChanged, setIsCloneImageChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState<boolean>(false);
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [highlightCard, setHighlightCard] = useState<CreateQuestionHighlightCard>(CreateQuestionHighlightCard.QUESTIONCARD);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const [isMultipleChoice, setIsMultipleChoice] = useState<boolean>(true);
  const [originalImageURl, setOriginalImageURL] = useState<string>('');
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
          answerSettings: {
            answerType: AnswerType.NUMBER,
            answerPrecision: AnswerPrecision.WHOLE,
          },
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
    setIsCloneImageChanged(true);
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

  // debounced question changes when writing to localStorage
  const handleDebouncedQuestionChange = useCallback( // eslint-disable-line
    debounce((draftQuestionInput: CentralQuestionTemplateInput) => {
      window.localStorage.setItem(StorageKey, JSON.stringify(draftQuestionInput));
    }, 1000),
    [] 
  );

  const handleTitleChange = (title: string) => {
    const { isFirstEdit } = draftQuestion.questionCard;
    const newDraftQuestion = updateDQwithTitle(draftQuestion, title);
    setDraftQuestion(newDraftQuestion);
    handleDebouncedQuestionChange(newDraftQuestion);
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  }

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

  const handleCorrectAnswerChange = (correctAnswer: string, draftQuestionInput: CentralQuestionTemplateInput) => {
    const { isFirstEdit } = draftQuestionInput.correctCard;
    const newDraftQuestion = updateDQwithCorrectAnswer(draftQuestionInput, correctAnswer);
    setDraftQuestion(newDraftQuestion);
    handleDebouncedQuestionChange(newDraftQuestion);
    if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
  };

  const handleCorrectAnswerStepsChange = (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
    const { isFirstEdit } = draftQuestionInput.correctCard;
      const newDraftQuestion = updateDQwithCorrectAnswerSteps(draftQuestionInput, steps);
      setDraftQuestion(newDraftQuestion);
      handleDebouncedQuestionChange(newDraftQuestion);
      if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
  };

  const handleAnswerSettingsChange = (draftQuestionInput: CentralQuestionTemplateInput, answerType: AnswerType,  answerPrecision?: AnswerPrecision,) => {
    const { isFirstEdit } = draftQuestionInput.correctCard;
    const newDraftQuestion = updateDQwithAnswerSettings(draftQuestionInput, answerType, answerPrecision);
    window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
    setDraftQuestion(newDraftQuestion);
    if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
  };

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

  const handleDiscardClick = (value: boolean) => {
    if (value){
      setIsDiscardModalOpen(false);
      window.localStorage.setItem(StorageKey, '');
      navigate('/');
      return;
    }
    setIsDiscardModalOpen(false);
  }
  
  const handleCheckCardsCompleteOnSave = () => {
    if (
      draftQuestion.questionCard.ccss.length > 0 && 
      draftQuestion.questionCard.ccss !== 'CCSS' &&
      draftQuestion.questionCard.title.length > 0 &&
      ((draftQuestion.questionCard.imageUrl && draftQuestion.questionCard.imageUrl?.length > 0) || draftQuestion.questionCard.image ) &&
      draftQuestion.correctCard.answer.length > 0 &&
      draftQuestion.correctCard.answerSteps.length > 0 &&
      draftQuestion.correctCard.answerSteps.every((step) => step.length > 0) &&
      draftQuestion.incorrectCards.length > 0 &&
      draftQuestion.incorrectCards.every((card) => card.answer.length > 0 && card.explanation.length > 0)
    )
      return true;
    return false;
  }

  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      console.log(draftQuestion);
      const isQuestionTemplateComplete = handleCheckCardsCompleteOnSave();
      console.log(isQuestionTemplateComplete);
      if (isQuestionTemplateComplete){
        if (draftQuestion.questionCard.image || draftQuestion.questionCard.imageUrl){
          setIsCreatingTemplate(true);
          let result = null;
          let url = null;
          // if the question is a clone and the image hasn't been changed, we can use the original imageUrl
          if (!isClone || draftQuestion.questionCard.imageUrl !== originalImageURl){
            if (draftQuestion.questionCard.image){
              const img = await apiClients.questionTemplate.storeImageInS3(draftQuestion.questionCard.image) 
              // have to do a nested await here because aws-storage returns a nested promise object
              result = await img.result;
              if (result && result.path && result.path.length > 0)
                url = result.path;
            } else if (draftQuestion.questionCard.imageUrl){
              url = await apiClients.questionTemplate.storeImageUrlInS3(draftQuestion.questionCard.imageUrl);
            }
          } else {
            url = draftQuestion.questionCard.imageUrl;
          }
          window.localStorage.setItem(StorageKey, '');
          console.log(draftQuestion.questionCard.imageUrl);
          if (url){
            apiClients.questionTemplate.createQuestionTemplate(publicPrivate, url, centralData.userProfile?.id || '', draftQuestion);
          }

          // update user stats
          const existingNumQuestions = centralData.userProfile?.questionsMade || 0;
          const newNumQuestions = existingNumQuestions + 1;
          await apiClients.user.updateUser({
              id: centralData.userProfile?.id || '',
              questionsMade: newNumQuestions,
            }
          );
          
          setIsCreatingTemplate(false);
          fetchElements();
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
      apiClients.questionTemplate.createQuestionTemplate(PublicPrivateType.DRAFT, url,centralData.userProfile?.id || '',  draftQuestion);
      setIsCreatingTemplate(false);
      navigate('/questions');
    } catch (e) {
      console.log(e);
    }
  }

  const handleDiscardQuestion = () => {
    setIsDiscardModalOpen(true);
  }

  const handleAIError = () => {
    setIsAIError(true);
  }

  const handleAIIsEnabled = () => {
    setIsAIEnabled((prev) => !prev);
    setIsAIError(false);
  }

  useEffect(() => {
    setIsLoading(false); 
    const selected = centralData?.selectedQuestion?.question;
    console.log(selected);
    const title = selected?.title;
    if (selected && isClone) {
      // regex to detect (clone of) in title
      const regex = /\(Clone of\)/i;
      if (title && !regex.test(title))
        selected.title = `(Clone of) ${title}`;
      const draft = assembleQuestionTemplate(selected);
      setDraftQuestion(prev => ({
        ...prev,
        ...draft,
      }));
      setOriginalImageURL(selected.imageUrl ?? '');
      setCompleteIncorrectAnswers(draft.incorrectCards.filter((card) => card.isCardComplete));
      setIncompleteIncorrectAnswers(draft.incorrectCards.filter((card) => !card.isCardComplete));
    }
    const id = route?.params.questionId;
    if (!centralData.selectedQuestion?.question && id){
      setIsLoading(true);
      fetchElement(GameQuestionType.QUESTION, id);
    }
  }, [centralData.selectedQuestion, route ]); // eslint-disable-line 

  return (
    <CreateQuestionMainContainer>
      <CreateQuestionBackground />
       <ModalBackground isModalOpen={isImageUploadVisible || isImageURLVisible || isCreatingTemplate || isCCSSVisible || isDiscardModalOpen} handleCloseModal={handleCloseModal}/>
       <CCSSTabs
          screenSize={screenSize}
          isTabsOpen={isCCSSVisible}
          handleCCSSSubmit={handleCCSSSubmit}
        />
        <DiscardModal 
          isModalOpen={isDiscardModalOpen}
          screenSize={screenSize}
          handleDiscardClick={handleDiscardClick}
        />
       <ImageUploadModal 
          draftQuestion={draftQuestion} 
          isClone={isClone}
          isCloneImageChanged={isCloneImageChanged}
          screenSize={screenSize}  
          isModalOpen={isImageUploadVisible} 
          handleImageChange={handleImageChange}
          handleImageSave={handleImageSave} 
          handleCloseModal={handleCloseModal}
        />
       <CreatingTemplateModal isModalOpen={isCreatingTemplate} templateType={TemplateType.QUESTION}/>
      <CreateQuestionBoxContainer>
        <TitleText screenSize={ScreenSize.LARGE}> 
          {isClone ? 'Clone' : 'Create'} Question
        </TitleText>
        {isLoading ? (
          <CircularProgress
            style={{ color: `${theme.palette.primary.circularProgress}` }}
          />
        ) : (
          <>
          {(screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM) && 
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
                <CentralButton buttonType={ButtonType.SAVEDRAFT} isEnabled smallScreenOverride onClick={handleSaveDraftQuestion} />
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
                    isClone={isClone}
                    isCloneImageChanged={isCloneImageChanged}
                    draftQuestion={draftQuestion}
                    handleTitleChange={handleTitleChange}
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
                        screenSize={screenSize}
                        isClone={isClone}
                        draftQuestion={draftQuestion}                   
                        isHighlight={highlightCard === CreateQuestionHighlightCard.CORRECTANSWER}
                        handleCorrectAnswerChange={handleCorrectAnswerChange}
                        handleCorrectAnswerStepsChange={handleCorrectAnswerStepsChange}
                        handleAnswerSettingsChange={handleAnswerSettingsChange}
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
                      isClone={isClone}
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
          </>
        )}
      </CreateQuestionBoxContainer>
    </CreateQuestionMainContainer>
  );
}