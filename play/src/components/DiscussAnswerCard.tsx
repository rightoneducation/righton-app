import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { GameSessionState } from '@righton/networking';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ResultSelector from './ResultSelector';

interface DiscussAnswerCardProps {
  isPlayerCorrect: boolean;
  instructions: string[];
  // answerStatus: AnswerState;
  // index: number;
  // answerText: string;
  // percentageText: string;
  // currentState: GameSessionState;
}

export default function DiscussAnswerCard({
  isPlayerCorrect,
  instructions
  // answerStatus,
  // index,
  // answerText,
  // percentageText,
  // currentState
}: DiscussAnswerCardProps) {
  const theme = useTheme();
  const resultText = isPlayerCorrect ? 'Yes, ' : 'Nice try, ';
  return (
    <BodyCardStyled elevation={5}>
      <BodyCardContainerStyled sx={{alignItems: 'flex-start', width: '100%'}}>
        <Typography variant="body1" sx={{fontWeight: 700, left: 0, paddingLeft: `${theme.sizing.extraSmallPadding}px`}}> 
          {resultText}
          <Typography variant="body1" sx={{display:'inline'}}> the correct answer is... </Typography>  
        </Typography>
         <ResultSelector 
          answerStatus={AnswerState.CORRECT}
          index={0}
          answerText='12'
          percentageText='66%'
          currentState={GameSessionState.PHASE_1_DISCUSS}
        /> 
        <Stack spacing={1}>
          {instructions.map((instruction, index) => (
          <Box key={uuidv4()} sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            <Box sx={{width:'30px'}}>
              <Typography variant="h3" sx={{width: '30px', fontWeight: 700, color: theme.palette.primary.darkPurple, lineHeight: '20px', textAlign: 'right'}}> {index+1} </Typography>
            </Box>
            <Typography variant="body1" sx={{ paddingLeft: `${theme.sizing.extraSmallPadding}px`}}> {instruction} </Typography>
          </Box>
          ))
          }
        </Stack>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
