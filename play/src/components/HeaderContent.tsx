import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import Timer from './Timer';

const HeaderContainer = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

interface HeaderContentProps {
  currentState: GameSessionState;
  totalTime: number;
  isPaused: boolean;
  isFinished: boolean;
  handleTimerIsFinished: () => void;
  isCorrect: boolean;
  isIncorrect: boolean;
}

export default function HeaderContent({
  currentState,
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished,
  isCorrect,
  isIncorrect,
}: HeaderContentProps) {
  const stateMap = {
    [GameSessionState.NOT_STARTED]: 'Answer the Question',
    [GameSessionState.TEAMS_JOINING]: 'Answer the Question',
    [GameSessionState.CHOOSE_CORRECT_ANSWER]: 'Answer the Question',
    [GameSessionState.CHOOSE_TRICKIEST_ANSWER]: 'Pick the Trickiest!',
    [GameSessionState.PHASE_1_DISCUSS]: 'Answer Explanations',
    [GameSessionState.PHASE_2_DISCUSS]: 'Answer Explanations',
    [GameSessionState.PHASE_2_START]: 'Answer Explanations',
    [GameSessionState.PHASE_1_RESULTS]: 'Phase 1 Results',
    [GameSessionState.PHASE_2_RESULTS]: 'Phase 2 Results',
    [GameSessionState.FINAL_RESULTS]: 'Answer the Question',
    [GameSessionState.FINISHED]: 'Answer the Question',
  };
  const stateCheck = (
    currentStateForCheck: GameSessionState,
    isCorrectForCheck: boolean,
    isIncorrectForCheck: boolean
  ) => {
    if (isCorrectForCheck) return 'Correct!';
    if (isIncorrectForCheck) return 'Nice Try!';
    return stateMap[currentStateForCheck];
  };

  return (
    <HeaderContainer>
      <Typography variant='h1'>{stateCheck(currentState, isCorrect, isIncorrect)}</Typography>
      {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
      currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ? (
        <Timer
          totalTime={totalTime}
          isFinished={isFinished}
          isPaused={isPaused}
          handleTimerIsFinished={handleTimerIsFinished}
        />
      ) : null}
    </HeaderContainer>
  );
}
