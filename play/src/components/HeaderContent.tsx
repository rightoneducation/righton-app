import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
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
  currentTimer: number;
  isPaused: boolean;
  isFinished: boolean;
  handleTimerIsFinished: () => void;
  isCorrect: boolean;
  isIncorrect: boolean;
}

export default function HeaderContent({
  currentState,
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  handleTimerIsFinished,
  isCorrect,
  isIncorrect,
}: HeaderContentProps) {
  const { t } = useTranslation();
  const stateMap = {
    [GameSessionState.NOT_STARTED]: t('gameinprogress.header.notstarted'),
    [GameSessionState.TEAMS_JOINING]: t('gameinprogress.header.teamsjoining'),
    [GameSessionState.CHOOSE_CORRECT_ANSWER]: t(
      'gameinprogress.header.choosecorrectanswer'
    ),
    [GameSessionState.CHOOSE_TRICKIEST_ANSWER]: t(
      'gameinprogress.header.choosetrickiestanswer'
    ),
    [GameSessionState.PHASE_1_DISCUSS]: t(
      'gameinprogress.header.phase1discuss'
    ),
    [GameSessionState.PHASE_2_DISCUSS]: t(
      'gameinprogress.header.phase2discuss'
    ),
    [GameSessionState.PHASE_2_START]: t('gameinprogress.header.phase2start'),

    [GameSessionState.FINAL_RESULTS]: t('gameinprogress.header.finalresults'),
    [GameSessionState.FINISHED]: t('gameinprogress.header.finished'),
  };
  const stateCheck = (
    currentStateForCheck: GameSessionState,
    isCorrectForCheck: boolean,
    isIncorrectForCheck: boolean
  ) => {
    if (isCorrectForCheck) return t('gameinprogress.header.correct');
    if (isIncorrectForCheck) return t('gameinprogress.header.incorrect');
    return stateMap[currentStateForCheck];
  };

  return (
    <HeaderContainer>
      <Typography variant="h1">
        {stateCheck(currentState, isCorrect, isIncorrect)}
      </Typography>
      {(currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
        currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) &&
 (
        <Timer
          totalTime={totalTime}
          currentTimer={currentTimer}
          isFinished={isFinished}
          isPaused={isPaused}
          handleTimerIsFinished={handleTimerIsFinished}
        />
      ) }
    </HeaderContainer>
  );
}
