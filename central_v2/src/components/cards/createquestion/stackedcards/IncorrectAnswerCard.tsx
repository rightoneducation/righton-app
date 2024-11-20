import React from 'react';
import { Paper, styled, InputAdornment } from '@mui/material';
import { CreateQuestionTemplateInput } from '../../../../lib/CentralModels';
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
  transition: 'box-shadow 0.6s',
}));

interface IncorrectAnswerCardProps {
  index: number;
  answer: string;
  explanation: string;
  isSelected?: boolean;
  handleLocalAnswerChange: (index: number, value: string) => void;
  handleLocalExplanationChange: (index: number, value: string) => void;
  isCardSubmitted: boolean;
}

export default function IncorrectAnswerCard({
  index,
  answer,
  explanation, 
  isSelected,
  handleLocalAnswerChange,
  handleLocalExplanationChange,
  isCardSubmitted,
} : IncorrectAnswerCardProps) {
  const [incorrectAnswer, setIncorrectAnswer] = React.useState<string>('');

  return (
    <AnswerCard elevation={6} isSelected={isSelected ?? false}>
      <QuestionTitleStyled>
        Incorrect Answer
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Distractor..." 
        value={answer}
        onChange={(e) => handleLocalAnswerChange(index, e.target.value)}
        error={isCardSubmitted && answer.length === 0}
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
        value={explanation}
        onChange={(e) => handleLocalExplanationChange(index, e.target.value)}
        error={isCardSubmitted && answer.length === 0}
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
