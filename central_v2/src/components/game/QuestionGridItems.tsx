import React, { useCallback, useState } from 'react';
import { Grid, Box, Typography, useTheme, debounce, Switch } from '@mui/material';
import { styled } from '@mui/material/styles'
import { CentralQuestionTemplateInput, IncorrectCard } from '@righton/networking';

import { CreateQuestionHighlightCard, ScreenSize, StorageKey } from '../../lib/CentralModels';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';
import { SubCardGridItem } from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import CorrectAnswerCard from '../cards/createquestion/CorrectAnswerCard';
import CreateQuestionCardBase from '../cards/createquestion/CreateQuestionCardBase';
import IncorrectAnswerCardStack from '../cards/createquestion/stackedcards/IncorrectAnswerCardStack';
import { updateDQwithCorrectAnswer, updateDQwithCorrectAnswerClick, updateDQwithCorrectAnswerSteps } from '../../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { updateDQwithQuestionClick, updateDQwithTitle } from '../../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import { getNextHighlightCard, handleMoveAnswerToComplete, updateDQwithIncorrectAnswerClick, updateDQwithIncorrectAnswers } from '../../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import useCreateQuestionLoader from '../../loaders/useCreateQuestionLoader';

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

interface IQuestionElements {
screenSize: ScreenSize;
handleSaveQuestion: () => Promise<void>
handleDiscardQuestion: () => void;
draftQuestion: CentralQuestionTemplateInput;
onSetDraftQuestion: React.Dispatch<React.SetStateAction<CentralQuestionTemplateInput>>;
isCardSubmitted: boolean;
isCardErrored: boolean;
highlightCard: CreateQuestionHighlightCard;
onSetHighlightCard: React.Dispatch<React.SetStateAction<CreateQuestionHighlightCard>>
}

export default function QuestionElements({ 
    screenSize, 
    draftQuestion, 
    onSetDraftQuestion,
    onSetHighlightCard,
    handleDiscardQuestion, 
    handleSaveQuestion,
    isCardSubmitted,
    isCardErrored,
    highlightCard,
}: IQuestionElements){
const theme = useTheme();
const localData = useCreateQuestionLoader();
 const [isAIError, setIsAIError] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
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
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);

const handleClick = (cardType: CreateQuestionHighlightCard) => {
    switch(cardType){
      case CreateQuestionHighlightCard.CORRECTANSWER:
        if (draftQuestion.correctCard.isCardComplete){
          const newDraftQuestion = updateDQwithCorrectAnswerClick(draftQuestion);
          window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
          onSetDraftQuestion(newDraftQuestion);
        }
        break;
      case CreateQuestionHighlightCard.INCORRECTANSWER1:
      case CreateQuestionHighlightCard.INCORRECTANSWER2:
      case CreateQuestionHighlightCard.INCORRECTANSWER3:
      {
        // then we can update the draftQuestion for the api call and the localStorage for retreival, respectively
        const newDraftQuestion = updateDQwithIncorrectAnswerClick(draftQuestion, cardType);
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
        onSetDraftQuestion(newDraftQuestion);
        break;
      }
      case CreateQuestionHighlightCard.QUESTIONCARD:
      default:
        if (draftQuestion.questionCard.isCardComplete){
          const newDraftQuestion = updateDQwithQuestionClick(draftQuestion);
          window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
          onSetDraftQuestion(newDraftQuestion);
        }
        break;
    }
  };

  const handleDebouncedTitleChange = useCallback( // eslint-disable-line
      debounce((title: string, draftQuestionInput: CentralQuestionTemplateInput) => {
        const { isFirstEdit } = draftQuestionInput.questionCard;
        const newDraftQuestion = updateDQwithTitle(draftQuestionInput, title);
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
        onSetDraftQuestion(newDraftQuestion);
        console.log(newDraftQuestion);
        if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
          onSetHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
      }, 1000),
      [] 
    );

    const handleDebouncedCorrectAnswerChange = useCallback( // eslint-disable-line
        debounce((correctAnswer: string, draftQuestionInput: CentralQuestionTemplateInput) => {
          const { isFirstEdit } = draftQuestionInput.correctCard;
          const newDraftQuestion = updateDQwithCorrectAnswer(draftQuestionInput, correctAnswer);
          console.log(newDraftQuestion);
          window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
          onSetDraftQuestion(newDraftQuestion);
          if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
            onSetHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
        }, 1000),
        [] 
      );

      const handleDebouncedCorrectAnswerStepsChange = useCallback( // eslint-disable-line
          debounce((steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
            const { isFirstEdit } = draftQuestionInput.correctCard;
            const newDraftQuestion = updateDQwithCorrectAnswerSteps(draftQuestionInput, steps);
            window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
            onSetDraftQuestion(newDraftQuestion);
            if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
              onSetHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
          }, 1000),
          [] 
        );


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
                onSetHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
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
            onSetDraftQuestion(newDraftQuestion);
            window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
          }
       
      }

    const handleImageUploadClick = () => {

    }

    const handleAIError = () => {
    setIsAIError(true);
  }

  const handleAIIsEnabled = () => {
    setIsAIEnabled((prev) => !prev);
    setIsAIError(false);
  }

  const handlePublicPrivateChange = () => {

  }

  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  }
    
    return (
        <>
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
                <AISwitch checked={isAIEnabled} onChange={() => handleAIIsEnabled()}/>
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
        </>
    )
}