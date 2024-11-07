import React from 'react';
import { Paper, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BaseCardStyled,
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

const AnswerCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
}));

interface IncorrectAnswerCardProps {
  answer: string;
}

export default function IncorrectAnswerCard({answer} : IncorrectAnswerCardProps) {
  return (
      <AnswerCard elevation={6}>
        <QuestionTitleStyled>
          Incorrect Answer {answer}
        </QuestionTitleStyled>
        <TextContainerStyled variant="outlined" rows='1' placeholder="Distractor..."/>
        <QuestionTitleStyled>
          Mistake Explanation
        </QuestionTitleStyled>
        <TextContainerStyled variant="outlined" rows='1' placeholder="Explanation..."/>
      </AnswerCard>
    
  )
}
