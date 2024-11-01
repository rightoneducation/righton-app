import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import {
  BaseCardStyled,
  QuestionTitleStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import CentralButton from '../../button/Button';
import { ButtonType } from '../../button/ButtonModels';

export default function DetailedQuestionSubCard() {
  const theme = useTheme();
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [solutionSteps, setSolutionSteps] = React.useState(['','','']);

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
        <TextContainerStyled variant="outlined" rows='1' placeholder="Step Contents...">
          {step}
        </TextContainerStyled>
      </Box>
    );
  };

  const addStep = () => {
    setSolutionSteps((prev) => [...prev, ''])
  }
  
  return (
    <BaseCardStyled>
      <QuestionTitleStyled>
        Correct Answer
      </QuestionTitleStyled>
      <TextContainerStyled variant="outlined" rows='1' placeholder="Correct Answer..."/>
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
