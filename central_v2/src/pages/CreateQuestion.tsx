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
import { updateDQwithImage, updateDQwithImageChange, updateDQwithTitle, updateDQwithCCSS, updateDQwithQuestionClick } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import { updateDQwithCorrectAnswer, updateDQwithCorrectAnswerSteps, updateDQwithCorrectAnswerClick } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { getNextHighlightCard, handleMoveAnswerToComplete, updateDQwithIncorrectAnswerClick, updateDQwithIncorrectAnswers, handleIncorrectCardClick } from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';

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
  const retrieveStorage = (): {retreivedDraftQuestion: CentralQuestionTemplateInput | null, retreivedIncompleteAnswers: IncorrectCard[] | null, retreivedCompleteAnswers: IncorrectCard[] | null} | null => {
    try{ 
      const storageObject = window.localStorage.getItem(StorageKey);
      let incompleteAnswers = null;
      let completeAnswers = null;
      let parsedObject = null;
      if (storageObject){
        parsedObject = JSON.parse(storageObject) as CentralQuestionTemplateInput;
        incompleteAnswers = parsedObject.incorrectCards.filter((card) =>  card.isCardComplete === false);
        completeAnswers = parsedObject.incorrectCards.filter((card) => card.isCardComplete);
      }
      return {retreivedDraftQuestion: parsedObject, retreivedIncompleteAnswers: incompleteAnswers, retreivedCompleteAnswers: completeAnswers }
    } catch (e) {
      console.error(e);
    }
    return null;
  }
  const retreivedData = retrieveStorage(); 
  let retreivedDraftQuestion: CentralQuestionTemplateInput | null = null;
  let retreivedIncompleteAnswers: IncorrectCard[] | null = null;
  let retreivedCompleteAnswers: IncorrectCard[] | null = null;
  if (retreivedData){
    retreivedDraftQuestion = retreivedData.retreivedDraftQuestion;
    retreivedIncompleteAnswers = retreivedData.retreivedIncompleteAnswers;
    retreivedCompleteAnswers = retreivedData.retreivedCompleteAnswers;
  }

  const [incompleteIncorrectAnswers, setIncompleteIncorrectAnswers] = useState<IncorrectCard[]>( 
    retreivedIncompleteAnswers ??
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
    retreivedCompleteAnswers ??
    []
  );

  const [draftQuestion, setDraftQuestion] = useState<CentralQuestionTemplateInput>(() => {
    return  retreivedDraftQuestion ?? {
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
          ...incompleteIncorrectAnswers, 
          ...completeIncorrectAnswers
        ]
      }
    }
  );
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);
  const [isCardErrored, setIsCardErrored] = useState<boolean>(false);

  // QuestionCardBase handler functions
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
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  };

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

  // CorrectAnswerCard handler functions
  const handleDebouncedCorrectAnswerChange = useCallback( // eslint-disable-line
    debounce((correctAnswer: string, draftQuestionInput: CentralQuestionTemplateInput) => {
      const { isFirstEdit } = draftQuestionInput.correctCard;
      const newDraftQuestion = updateDQwithCorrectAnswer(draftQuestionInput, correctAnswer);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
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
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
    }, 1000),
    [] 
  )

  // incorrect answer card functions
  const handleNextCardButtonClick = () => {
    const { newIncompleteAnswers, newCompleteAnswers }= handleMoveAnswerToComplete(incompleteIncorrectAnswers, completeIncorrectAnswers);
    setIncompleteIncorrectAnswers(newIncompleteAnswers);
    setCompleteIncorrectAnswers(newCompleteAnswers);
  };

  const handleIncorrectCardStackUpdate = (cardData: IncorrectCard, draftQuestionInput: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[]) => {
      const nextCard = getNextHighlightCard(cardData.id as CreateQuestionHighlightCard);
      const isUpdateInIncompleteCards = incompleteAnswers.find(answer => answer.id === cardData.id);
      let newDraftQuestion = null;
      // we need to break this up so we don't change the stateful arrays when a card is not being passed across them. 
      // everytime we update those arrays, we're going to trigger an animation, so we have to only manipulate them when we want that
      // so in this case, if the card that is being edited is already complete, we are only going to update the draftQuestion object and leave the arrays alone
      if (isUpdateInIncompleteCards){
        const updatedAnswers = incompleteAnswers.map((answer) => {
          if (answer.id === cardData.id) {
            return cardData;
          }
          return answer;
        });
        // adjust incomplete and complete arrays, moving completed card over
        const { newIncompleteAnswers, newCompleteAnswers } = handleMoveAnswerToComplete(updatedAnswers, completeAnswers);
        // adjust local state for the cards so that they animate properly through the stack
        setIncompleteIncorrectAnswers(newIncompleteAnswers);
        setCompleteIncorrectAnswers(newCompleteAnswers);

        newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, newIncompleteAnswers, newCompleteAnswers);
        if (cardData.isFirstEdit)
          setHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
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

  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      if (draftQuestion.questionCard.isCardComplete && draftQuestion.correctCard.isCardComplete && draftQuestion.incorrectCards.every((card) => card.isCardComplete)){
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
              <IncorrectAnswerCardStack 
                draftQuestion={draftQuestion}
                completeIncorrectAnswers={completeIncorrectAnswers}
                incompleteIncorrectAnswers={incompleteIncorrectAnswers}
                highlightCard={highlightCard} 
                handleNextCardButtonClick={handleNextCardButtonClick}
                handleIncorrectCardStackUpdate={handleIncorrectCardStackUpdate}
                handleCardClick={handleClick} 
                isCardSubmitted={isCardSubmitted}
              />
            </SubCardGridItem>
          </Grid>
        </Grid>
        <Grid sm md item />
      </CreateQuestionGridContainer>
    </CreateQuestionMainContainer>
  );
}