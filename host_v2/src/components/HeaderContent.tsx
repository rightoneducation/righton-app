import React from 'react';
import { GameSessionState, IGameSession } from '@righton/networking';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ScreenSize } from '../lib/HostModels';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import QuestionIndicator from './QuestionIndicator';
import playerIcon from '../img/playerIcon.svg';
import HostPlayerIconContainer from '../lib/styledcomponents/HostPlayerIconContainer';
import Timer from './Timer';

import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import { GameSessionContext } from '../lib/context/GameSessionContext';


interface HeaderContentProps {
  isCorrect: boolean;
  isIncorrect: boolean;
  totalTime: number;
  isAddTime?: boolean;
  screenSize?: ScreenSize;
} // eslint-disable-line

export default function HeaderContent({
  isCorrect,
  isIncorrect,
  totalTime,
  isAddTime,
  screenSize,
}: HeaderContentProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const localGameSession = useTSGameSessionContext(GameSessionContext);

  const stateMap = {
    [GameSessionState.NOT_STARTED]: t('gameinprogress.header.notstarted'),
    [GameSessionState.TEAMS_JOINING]: t('gameinprogress.header.teamsjoining'),
    [GameSessionState.CHOOSE_CORRECT_ANSWER]: t(
      'gameinprogress.header.choosecorrectanswer',
    ),
    [GameSessionState.CHOOSE_TRICKIEST_ANSWER]: t(
      'gameinprogress.header.choosetrickiestanswer',
    ),
    [GameSessionState.PHASE_1_DISCUSS]: t(
      'gameinprogress.header.phase1discuss',
    ),
    [GameSessionState.PHASE_2_DISCUSS]: t(
      'gameinprogress.header.phase2discuss',
    ),
    [GameSessionState.PHASE_2_START]: t('gameinprogress.header.phase2start'),
    [GameSessionState.FINAL_RESULTS]: t('gameinprogress.header.finalresults'),
    [GameSessionState.FINISHED]: t('gameinprogress.header.finished'),
  };

  const stateCheck = (
    currentStateForCheck: GameSessionState,
    isCorrectForCheck: boolean,
    isIncorrectForCheck: boolean,
  ) => {
    if (isCorrectForCheck) return t('gameinprogress.header.correct');
    if (isIncorrectForCheck) return t('gameinprogress.header.incorrect');
    return stateMap[currentStateForCheck];
  };
  
  return (
    <HeaderStackContainerStyled>
      <Container style={{maxWidth: screenSize === ScreenSize.MEDIUM ? 'none' : 720, paddingLeft: screenSize === ScreenSize.LARGE ? 0 : screenSize === ScreenSize.MEDIUM ? `${theme.sizing.lgPadding}px` : `${theme.sizing.mdPadding}px`, paddingRight: screenSize === ScreenSize.LARGE ? 0 : screenSize === ScreenSize.MEDIUM ? `${theme.sizing.lgPadding}px` : `${theme.sizing.mdPadding}px`}}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <QuestionIndicator
              currentState={localGameSession.currentState}
            />
          </Grid>
        </Grid>
        <Grid item style={{ paddingTop: '24px' }}>
          <Typography variant="h1" style={{ fontSize: '24px', lineHeight: '36px', fontFamily: 'Poppins' }}>
            {stateCheck(localGameSession.currentState, isCorrect, isIncorrect)}
          </Typography>
        </Grid>
        <Grid item style={{paddingTop: `${theme.sizing.xSmPadding}px`}}>
              <Timer
                totalTime={totalTime}
                isAddTime={isAddTime}
                localGameSession={localGameSession}
              />
        
        </Grid>
      </Container>
    </HeaderStackContainerStyled>
  );
}
