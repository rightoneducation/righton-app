import React, { useState, useMemo} from 'react';
import { Paper, styled, InputAdornment } from '@mui/material';
import { debounce } from 'lodash';
import { CreateQuestionHighlightCard, IncorrectAnswer } from '../../../../lib/CentralModels';
import errorIcon from '../../../../images/errorIcon.svg';
import { ErrorIcon } from '../../../../lib/styledcomponents/CentralStyledComponents';
import {
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

interface StyledCardProps {
  isHighlight: boolean;
}

const AnswerCard = styled(Paper)<StyledCardProps>(({ theme, isHighlight }) => ({
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
  transition: 'box-shadow 0.6s',
}));

interface IncorrectAnswerCardProps {
  answerData: IncorrectAnswer;
  isHighlight?: boolean;
  isCardComplete: boolean;
  isCardSubmitted: boolean;
  handleUpdateCardData: (cardData: IncorrectAnswer, isCardComplete: boolean) => void;
  handleCardClick: (cardType: CreateQuestionHighlightCard) => void;
}

export default function IncorrectAnswerCard({
  answerData,
  isHighlight,
  isCardComplete,
  isCardSubmitted,
  handleUpdateCardData,
  handleCardClick
} : IncorrectAnswerCardProps) {

  const [cardData, setCardData] = useState<IncorrectAnswer>({
    id: answerData.id,
    answer: answerData.answer,
    explanation: answerData.explanation,
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
    debounce((debounceCardData: IncorrectAnswer, debounceIsCardComplete: boolean) => {
      handleUpdateCardData(debounceCardData, debounceIsCardComplete);
    }, 1000)
  , [handleUpdateCardData]);

  const handleLocalAnswerChange = (value: string) => {
    setCardData({
      ...cardData,
      answer: value,
    })
    if (value.length > 0 && cardData.explanation.length > 0)
      debouncedCardChanges({...cardData, answer: value, isCardComplete: true}, isCardComplete);
  }

  const handleLocalExplanationChange = (value: string) => {
    setCardData({
      ...cardData,
      explanation: value,
    })
    if (value.length > 0 && cardData.explanation.length > 0)
      debouncedCardChanges({...cardData, explanation: value, isCardComplete: true}, isCardComplete);
  }

  return (
    <AnswerCard elevation={6} isHighlight={isHighlight ?? false} onClick={() => handleCardClick(getCardType())}>
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
        error={isCardSubmitted && answerData.answer.length === 0}
        InputProps={{
          startAdornment: 
           isCardSubmitted && answerData.answer.length === 0 &&
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
      <QuestionTitleStyled>
        Mistake Explanation
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Explanation..." 
        value={cardData.explanation}
        onChange={(e) => handleLocalExplanationChange(e.target.value)}
        error={isCardSubmitted && answerData.answer.length === 0}
        InputProps={{
          startAdornment: 
            isCardSubmitted && answerData.explanation.length === 0 &&
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
