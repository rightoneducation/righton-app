import React, { useEffect } from 'react';
import { Typography, Box, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import {
  QuestionTitleStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { 
  TextContainerStyled, 
  BaseCardStyled 
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon
} from '../../../lib/styledcomponents/CentralStyledComponents';
import CentralButton from '../../button/Button';
import { ButtonType } from '../../button/ButtonModels';
import errorIcon from '../../../images/errorIcon.svg';
import { CreateQuestionTemplateInput } from '../../../lib/CentralModels';

interface DetailedQuestionSubCardProps {
  draftQuestion: CreateQuestionTemplateInput;
  isCardSubmitted: boolean;
  isHighlight: boolean;
  handleCorrectAnswerChange: (correctAnswer: string, draftQuestion: CreateQuestionTemplateInput) => void;
  handleCorrectAnswerStepsChange: (steps: string[], draftQuestion: CreateQuestionTemplateInput) => void;
}

export default function DetailedQuestionSubCard({
  draftQuestion,
  isCardSubmitted,
  isHighlight, 
  handleCorrectAnswerChange,
  handleCorrectAnswerStepsChange,
}: DetailedQuestionSubCardProps) {
  const theme = useTheme();
  const [correctAnswer, setCorrectAnswer] = React.useState<string>('');
  const [solutionSteps, setSolutionSteps] = React.useState(['','','']);
  const isCardComplete = draftQuestion.correctAnswer.length > 0 && draftQuestion.correctAnswerSteps.length > 0 && draftQuestion.correctAnswerSteps.every(step => step.length > 0);
  const addStep = () => {
    setSolutionSteps((prev) => [...prev, ''])
  };

  const handleCorrectChange = (value: string ) => {
    setCorrectAnswer((prev) => value);
    handleCorrectAnswerChange(value, draftQuestion);
  };

  const handleStepChange = (index: number, value: string): void => {
    const newSteps = [...solutionSteps];
    newSteps[index] = value;
    setSolutionSteps(newSteps);
    handleCorrectAnswerStepsChange(newSteps, draftQuestion);
  };

  const solutionStepsComponent = (step: string, index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
          gap: `${theme.sizing.xSmPadding}px`,
        }}
        key={index}
      >
        <Typography
          sx={{
            fontSize: `${theme.typography.h3.fontSize}px`,
            fontWeight: `${theme.typography.h3.fontWeight}`,
            color: `${theme.palette.primary.darkPurple}`,
          }}
        >
          {index + 1}
        </Typography>
        <TextContainerStyled 
            multiline 
            variant="outlined" 
            value={solutionSteps[index]}
            onChange={(e) => handleStepChange(index, e.target.value)}
            rows='1' 
            placeholder="Step Contents" 
            error={isCardSubmitted && (!draftQuestion.correctAnswerSteps[index] || draftQuestion.correctAnswerSteps[index].length === 0)}
            InputProps={{
              startAdornment: 
              isCardSubmitted && (!draftQuestion.correctAnswerSteps[index] || draftQuestion.correctAnswerSteps[index].length === 0) &&
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
      </Box>
    );
  };
  
  return (
    <BaseCardStyled elevation={6} isHighlight={isHighlight} isCardComplete={isCardComplete}>
      <QuestionTitleStyled>
        Correct Answer
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Correct Answer..." 
        value={correctAnswer}
        onChange={(e) => handleCorrectChange(e.target.value)}
        error={isCardSubmitted && (!draftQuestion.correctAnswer || draftQuestion.correctAnswer.length === 0)}
        InputProps={{
          startAdornment: 
          isCardSubmitted && (!draftQuestion.correctAnswer || draftQuestion.correctAnswer.length === 0) &&
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
        Solution Steps
      </QuestionTitleStyled>
      {solutionSteps && 
        solutionSteps.map((step, index) => 
          solutionStepsComponent(step, index)
        )
      }
      <Box style = {{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <CentralButton buttonType={ButtonType.ADDSTEP} isEnabled onClick={addStep}/>
      </Box>
    </BaseCardStyled>
  );
}
