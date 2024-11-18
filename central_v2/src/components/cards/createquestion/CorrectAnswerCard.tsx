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

interface DetailedQuestionSubCardProps {
  isSelected: boolean;
  setSelectedCard: (selectedCard: string) => void;
}

export default function DetailedQuestionSubCard({isSelected, setSelectedCard}: DetailedQuestionSubCardProps) {
  const theme = useTheme();
  const [correctAnswer, setCorrectAnswer] = React.useState<string>('');
  const [solutionSteps, setSolutionSteps] = React.useState(['','','']);
  const [isCardComplete, setIsCardComplete] = React.useState<boolean>(false);

  const solutionStepsComponent = (step: string, index: number, handleChange: (index: number, event: string) => void) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
          gap: `${theme.sizing.xSmPadding}px`,
        }}
        key={uuidv4()}
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
            rows='1' 
            placeholder="Step Contents" 
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
      </Box>
    );
  };

  const addStep = () => {
    setSolutionSteps((prev) => [...prev, ''])
  }

  // normally we try to minimize the use of effects in our components
  // this seems like such a typical use case for a useEffect
  useEffect(() => {
    let cardComplete = true;
    solutionSteps.forEach(step => {
      if (step === '') {
        cardComplete = false;
      }
    });
    if (correctAnswer === '') {
      cardComplete = false;
    }
    setIsCardComplete(cardComplete);
    if (cardComplete)
      setSelectedCard('');
  },[solutionSteps, correctAnswer, setSelectedCard]);

  const handleCorrectChange = (value: string ) => {
    setCorrectAnswer((prev) => value);
  }

  const handleStepChange = (index: number, value: string): void => {
    const newSteps = [...solutionSteps];
    newSteps[index] = value;
    setSolutionSteps(newSteps);
  };
  
  return (
    <BaseCardStyled elevation={6} isSelected={isSelected} isCardComplete={isCardComplete}>
      <QuestionTitleStyled>
        Correct Answer
      </QuestionTitleStyled>
      <TextContainerStyled 
        multiline 
        variant="outlined" 
        rows='1' 
        placeholder="Correct Answer..." 
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
        onChange={(e) => handleCorrectChange(e.target.value)}
      />
      <QuestionTitleStyled>
        Solution Steps
      </QuestionTitleStyled>
      {solutionSteps && 
        solutionSteps.map((step, index) => 
          solutionStepsComponent(step, index, handleStepChange)
        )
      }
      <Box style = {{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <CentralButton buttonType={ButtonType.ADDSTEP} isEnabled onClick={addStep}/>
      </Box>
    </BaseCardStyled>
  );
}
