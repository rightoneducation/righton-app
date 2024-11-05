import React from 'react';
import { Paper, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BaseCardStyled,
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

interface StackedCardProps {
  index: number;
}


const StackedCard = styled(Paper)<StackedCardProps>(({ theme, index }) => ({
  position: 'absolute',
  top: `${index * 50}px`,
  zIndex: 3-index,
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  gap: `${theme.sizing.smPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
}));

interface IncorrectAnswerCardProps {
  index: number;
}

export default function IncorrectAnswerCard({index} : IncorrectAnswerCardProps) {
  return (
    <StackedCard index={index} elevation={6}>
      <QuestionTitleStyled>
        Incorrect Answer
      </QuestionTitleStyled>
      <TextContainerStyled variant="outlined" rows='1' placeholder="Distractor..."/>
      <QuestionTitleStyled>
        Mistake Explanation
      </QuestionTitleStyled>
      <TextContainerStyled variant="outlined" rows='1' placeholder="Explanation..."/>
    </StackedCard>
  );
}
