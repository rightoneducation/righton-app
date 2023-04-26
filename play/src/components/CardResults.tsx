import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import ResultSelector from './ResultSelector';
import AnswerSelector from './AnswerSelector';
import { AnswerState } from '../lib/PlayModels';
import {
  BodyCard,
  BodyCardContainer,
} from '../lib/styledcomponents/StyledComponents';

interface CardResultsProps {
  answers: { text: string; isCorrectAnswer: boolean }[] | undefined;
  selectedAnswer: number | null;
  isMobileDevice: boolean;
  currentState: GameSessionState;
}

export default function CardResults({
  answers,
  selectedAnswer,
  isMobileDevice,
  currentState,

}: CardResultsProps) {
  const theme = useTheme();
  const percentageText = '66%';
 

  return (
    <BodyCard elevation={5} sx={{boxSizing: 'border-box', width: '100%'}}>
      <BodyCardContainer spacing={2}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          {answers?.map((answer, index) => (
              <ResultSelector
               answerStatus={
                selectedAnswer === index
                  ? AnswerState.SELECTED
                  : AnswerState.DEFAULT
                }
                index={index}
                answerText={answer.text}
                percentageText={percentageText}
                currentState={currentState}
                key={uuidv4()}
                playerCorrect
              />
          ))}
        </Stack>
      </BodyCardContainer>
    </BodyCard>
  );
}
