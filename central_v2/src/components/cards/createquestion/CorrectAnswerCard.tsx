import React, { useEffect } from 'react';
import { Typography, Box, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CentralQuestionTemplateInput } from '@righton/networking';
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


interface DetailedQuestionSubCardProps {
  draftQuestion: CentralQuestionTemplateInput;
  isHighlight: boolean;
  handleCorrectAnswerChange: (correctAnswer: string, draftQuestion: CentralQuestionTemplateInput) => void;
  handleCorrectAnswerStepsChange: (steps: string[], draftQuestion: CentralQuestionTemplateInput) => void;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
}

export default function DetailedQuestionSubCard({
  draftQuestion,
  isHighlight, 
  handleCorrectAnswerChange,
  handleCorrectAnswerStepsChange,
  isCardSubmitted,
  isCardErrored
}: DetailedQuestionSubCardProps) {
  const theme = useTheme();
  const [correctAnswer, setCorrectAnswer] = React.useState<string>('');
  const [answerSteps, setAnswerSteps] = React.useState(['','','']);
  const addStep = () => {
    setAnswerSteps((prev) => [...prev, ''])
  };

  const handleCorrectChange = (value: string ) => {
    setCorrectAnswer((prev) => value);
    handleCorrectAnswerChange(value, draftQuestion);
  };

  const handleStepChange = (index: number, value: string): void => {
    const newSteps = [...answerSteps];
    newSteps[index] = value;
    setAnswerSteps(newSteps);
    handleCorrectAnswerStepsChange(newSteps, draftQuestion);
  };

  const answerStepsComponent = (step: string, index: number) => {
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
            value={answerSteps[index]}
            onChange={(e) => handleStepChange(index, e.target.value)}
            rows='1' 
            placeholder="Step Contents" 
            error={isCardErrored && (!answerSteps[index] || answerSteps[index].length === 0)}
            InputProps={{
              startAdornment: 
              isCardErrored && (!answerSteps[index] || answerSteps[index].length === 0) &&
                <InputAdornment
                  position="start" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    mt: '10px',
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
    <BaseCardStyled elevation={6} isHighlight={isHighlight} isCardComplete={draftQuestion.correctCard.isCardComplete}>
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
        error={isCardSubmitted && (!correctAnswer || correctAnswer.length === 0)}
        InputProps={{
          startAdornment: 
          isCardSubmitted && (!correctAnswer || correctAnswer.length === 0) &&
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
      {answerSteps && 
        answerSteps.map((step, index) => 
          answerStepsComponent(step, index)
        )
      }
      <Box style = {{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <CentralButton buttonType={ButtonType.ADDSTEP} isEnabled onClick={addStep}/>
      </Box>
    </BaseCardStyled>
  );
}
