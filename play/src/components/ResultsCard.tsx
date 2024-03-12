import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Stack } from '@mui/material';
import {
  GameSessionState,
  IGameSession,
  BackendAnswer,
  IChoice,
  ModelHelper,
} from '@righton/networking';
import ResultSelector from './ResultSelector';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface CardResultsProps {
  answers: IChoice[];
  selectedAnswer: BackendAnswer | null;
  currentState: GameSessionState;
  currentQuestionId: string;
  gameSession: IGameSession;
}

export default function CardResults({
  answers,
  selectedAnswer,
  currentState,
  currentQuestionId,
  gameSession,
}: CardResultsProps) {
  // determines what type of answer result to display
  const answerType = (answer: { text: string; isAnswer: boolean }) => {
    if (answer?.isAnswer && answer?.text === selectedAnswer?.text)
      return AnswerState.PLAYER_SELECTED_CORRECT;
    if (answer?.text === selectedAnswer?.text) return AnswerState.SELECTED;
    if (answer?.isAnswer) return AnswerState.CORRECT;
    return AnswerState.DEFAULT;
  };

  return (
    <BodyCardStyled
      elevation={10}
      sx={{ boxSizing: 'border-box', width: '100%' }}
    >
      <BodyCardContainerStyled spacing={2}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          {answers?.map((answer, index) => (
            <ResultSelector
              answerStatus={answerType(answer)}
              index={index}
              answerText={answer.text}
              percentageText={
                currentState === GameSessionState.PHASE_1_RESULTS
                  ? ''
                  : `${ModelHelper.calculateBasicModeWrongAnswerScore(
                      gameSession,
                      answer.text,
                      currentQuestionId
                    )}%`
              }
              currentState={currentState}
              key={uuidv4()}
            />
          ))}
        </Stack>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
