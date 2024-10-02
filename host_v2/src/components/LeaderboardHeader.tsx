import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameSessionState } from '@righton/networking';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import QuestionIndicator from './QuestionIndicator';
import playerIcon from '../img/playerIcon.svg';
import HostPlayerIconContainer from '../lib/styledcomponents/HostPlayerIconContainer';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import { GameSessionContext } from '../lib/context/GameSessionContext';

export default function LeaderboardHeader() {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const localGameSession = useTSGameSessionContext(GameSessionContext);

  return (
    <HeaderStackContainerStyled>
      <Container maxWidth="md">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <QuestionIndicator
              totalQuestions={localGameSession.questions.length}
              currentQuestionIndex={localGameSession.currentQuestionIndex}
            />
          </Grid>
        </Grid>
        <Grid item style={{ paddingTop: `${theme.sizing.xxSmPadding}px` }}>
          <Typography variant="h1" style={{ fontSize: '24px', lineHeight: '36px', fontFamily: 'Poppins' }}>
          {localGameSession.currentState === GameSessionState.TEAMS_JOINING ? t('gameinprogress.header.leaderboard') : t('gameinprogress.header.finalresults')}
          </Typography>
        </Grid>
      </Container>
    </HeaderStackContainerStyled>
  );
}
