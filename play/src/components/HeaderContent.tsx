import React from 'react';
import { Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { GameSessionState } from '@righton/networking';
import { ScreenSize } from '../lib/PlayModels';
import Timer from './Timer';

const MAX_WIDTH_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '100%',
  [ScreenSize.MEDIUM]: '326px',
  [ScreenSize.LARGE]: '326px',
};

interface HeaderContainerProps {
  screenSize: ScreenSize;
  disableInnerPadding?: boolean;
}

const HeaderContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'screenSize' && prop !== 'disableInnerPadding',
})<HeaderContainerProps>(({ theme, screenSize, disableInnerPadding }) => ({
  width: '100%',
  maxWidth: MAX_WIDTH_BY_SIZE[screenSize],
  paddingLeft: disableInnerPadding || screenSize !== ScreenSize.SMALL ? 0 : `${theme.sizing.lgPadding}px`,
  paddingRight: disableInnerPadding || screenSize !== ScreenSize.SMALL ? 0 : `${theme.sizing.lgPadding}px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.xSmPadding}px`,
}));

interface HeaderContentProps {
  currentState: GameSessionState;
  totalTime: number;
  currentTimer: number;
  isPaused: boolean;
  isFinished: boolean;
  isAddTime?: boolean;
  handleTimerIsFinished: () => void;
  isCorrect: boolean;
  isIncorrect: boolean;
  disableInnerPadding?: boolean;
}

export default function HeaderContent({
  currentState,
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  isAddTime,
  handleTimerIsFinished,
  isCorrect,
  isIncorrect,
  disableInnerPadding,
}: HeaderContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  let screenSize = ScreenSize.MEDIUM;
  if (isLargeScreen) screenSize = ScreenSize.LARGE;
  else if (isSmallScreen) screenSize = ScreenSize.SMALL;

  const stateMap = {
    [GameSessionState.NOT_STARTED]: t('gameinprogress.header.notstarted'),
    [GameSessionState.TEAMS_JOINING]:  t('gameinprogress.header.leaderboard'),
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
    <HeaderContainer screenSize={screenSize} disableInnerPadding={disableInnerPadding}>
      <Typography variant="h0">
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
          isAddTime={isAddTime}
          handleTimerIsFinished={handleTimerIsFinished}
          screenSize={screenSize}
        />
      ) }
    </HeaderContainer>
  );
}
