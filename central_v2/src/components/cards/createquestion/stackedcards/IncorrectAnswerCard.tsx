import React from 'react';
import { Paper, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BaseCardStyled,
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

interface AnswerCardProps {
  index?: number;
  isCompleted: boolean;
}

const AnswerCard = styled(Paper)<AnswerCardProps>(({ theme, index, isCompleted }) => ({
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
  index?: number;
  isCompleted: boolean;
}

export default function IncorrectAnswerCard({answer, index, isCompleted} : IncorrectAnswerCardProps) {
  return (
      <AnswerCard elevation={6} isCompleted={isCompleted} index={index}>
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
