import React, { useState, useMemo} from 'react';
import { Paper, Box, styled, InputAdornment } from '@mui/material';
import { debounce } from 'lodash';
import { CentralQuestionTemplateInput, IncorrectCard, AIButton } from '@righton/networking';
import { CreateQuestionHighlightCard, } from '../../../../lib/CentralModels';
import errorIcon from '../../../../images/errorIcon.svg';
import { ErrorIcon } from '../../../../lib/styledcomponents/CentralStyledComponents';
import {
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

interface StyledCardProps {
  isHighlight: boolean;
  isCardComplete: boolean;
  isCardClicked: boolean;
}

const AnswerCard = styled(Paper)<StyledCardProps>(({ theme, isHighlight, isCardComplete, isCardClicked }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  boxShadow: isHighlight ? `0px 0px 25px 0px ${theme.palette.primary.extraDarkBlue}` : '',
  opacity: isCardComplete && !isCardClicked ? 0.6 : 1,
  transition: 'box-shadow 0.6s, opacity  0.6s',
}));

interface IncorrectAnswerCardProps {
  answerData: IncorrectCard;
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight?: boolean;
  isCardSubmitted: boolean;
  handleIncorrectCardStackUpdate: (cardData: IncorrectCard, draftQuestion: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[]) => void;
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
  completeAnswers: IncorrectCard[];
  incompleteAnswers: IncorrectCard[];
}

export default function IncorrectAnswerCard({
  answerData,
  draftQuestion,
  isHighlight,
  isCardSubmitted,
  handleIncorrectCardStackUpdate,
  handleCardClick,
  completeAnswers,
  incompleteAnswers
} : IncorrectAnswerCardProps) {

  const [isCardClicked, setIsCardClicked] = useState<boolean>(false);
  const [cardData, setCardData] = useState<IncorrectCard>({
    id: answerData.id,
    answer: answerData.answer,
    explanation: answerData.explanation,
    isFirstEdit: answerData.isFirstEdit,
    isCardComplete: answerData.isCardComplete,
  })
  
  const getCardType = () => {
    switch(answerData.id){
      case 'card-2':
        return CreateQuestionHighlightCard.INCORRECTANSWER2;
      case 'card-3':
        return CreateQuestionHighlightCard.INCORRECTANSWER3;
      case 'card-1':
      default:
        return CreateQuestionHighlightCard.INCORRECTANSWER1;
    }
  } 

  const debouncedCardChanges = useMemo(() => 
    debounce((debounceCardData: IncorrectCard, debouncedDraftQuestion: CentralQuestionTemplateInput, debounceCompleteAnswers: IncorrectCard[], debounceIncompleteAnswers: IncorrectCard[]) => {
      setIsCardClicked(false);
      handleIncorrectCardStackUpdate(debounceCardData, debouncedDraftQuestion, debounceCompleteAnswers, debounceIncompleteAnswers);
    }, 1000)
  , [handleIncorrectCardStackUpdate]);

  const handleLocalAnswerChange = (value: string) => {
    setCardData({
      ...cardData,
      answer: value,
    })
      debouncedCardChanges({...cardData, answer: value}, draftQuestion, completeAnswers, incompleteAnswers);
  }

  const handleLocalExplanationChange = (value: string) => {
    setCardData({
      ...cardData,
      explanation: value,
    })
      debouncedCardChanges({...cardData, explanation: value}, draftQuestion, completeAnswers, incompleteAnswers);
  }

  const handleLocalCardClick = () => {
    setIsCardClicked(true);
    // handleCardClick(getCardType())
  }

  return (
    <AnswerCard elevation={6} isHighlight={isHighlight ?? false} isCardComplete={answerData.isCardComplete} isCardClicked={isCardClicked} onClick={handleLocalCardClick}>
      <QuestionTitleStyled>
        Incorrect Answer
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Distractor..." 
        value={cardData.answer}
        onChange={(e) => handleLocalAnswerChange(e.target.value)}
        error={isCardSubmitted && cardData.answer.length === 0}
        InputProps={{
          startAdornment: 
           isCardSubmitted && cardData.answer.length === 0 &&
            <InputAdornment
              position="start" 
              sx={{ 
                alignSelf: 'flex-start',
                mt: '10px'
              }}
            >
              <ErrorIcon src={errorIcon} alt='error icon'/>
            </InputAdornment>
        }}
      />
      <Box>
      <QuestionTitleStyled>
        Mistake Explanation
      </QuestionTitleStyled>
      <AIButton />
      </Box>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Explanation..." 
        value={cardData.explanation}
        onChange={(e) => handleLocalExplanationChange(e.target.value)}
        error={isCardSubmitted && cardData.explanation.length === 0}
        InputProps={{
          startAdornment: 
            isCardSubmitted && cardData.explanation.length === 0 &&
            <InputAdornment
              position="start" 
              sx={{ 
                alignSelf: 'flex-start',
                mt: '10px'
              }}
            >
              <ErrorIcon src={errorIcon} alt='error icon'/>
            </InputAdornment>
        }}
      />
    </AnswerCard>
  )
}
