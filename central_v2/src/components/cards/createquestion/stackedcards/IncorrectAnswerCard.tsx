import React from 'react';
import { Paper, styled, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import errorIcon from '../../../../images/errorIcon.svg';
import { ErrorIcon } from '../../../../lib/styledcomponents/CentralStyledComponents';
import {
  QuestionTitleStyled,
} from '../../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../../lib/styledcomponents/CreateQuestionStyledComponents';

interface StyledCardProps {
  isSelected: boolean;
}

const AnswerCard = styled(Paper)<StyledCardProps>(({ theme, isSelected }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  boxShadow: isSelected ? `0px 0px 25px 0px ${theme.palette.primary.extraDarkBlue}` : '',
}));

interface IncorrectAnswerCardProps {
  answer: string;
  isSelected?: boolean;
}

export default function IncorrectAnswerCard({answer, isSelected} : IncorrectAnswerCardProps) {
  return (
    <AnswerCard elevation={6} isSelected={isSelected ?? false}>
      <QuestionTitleStyled>
        Incorrect Answer {answer}
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Distractor..." 
        error
        InputProps={{
          startAdornment: 
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
        error
        InputProps={{
          startAdornment: 
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
