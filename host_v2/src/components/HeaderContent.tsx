import React from 'react';
import { GameSessionState } from '@righton/networking';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import QuestionIndicator from './QuestionIndicator';
import playerIcon from '../img/playerIcon.svg';
import HostPlayerIconContainer from '../lib/styledcomponents/HostPlayerIconContainer';
import { LocalModel } from '../lib/HostModels';
import Timer from './Timer';
import TimerAddButton from '../lib/styledcomponents/TimerAddButton';
import { useTSGameSessionContext } from '../hooks/context/useLocalGameSessionContext';
import { LocalGameSessionContext } from '../lib/context/LocalGameSessionContext';


interface HeaderContentProps {
  isCorrect: boolean;
  isIncorrect: boolean;
  totalTime: number;
  currentTimer: number;
  isPaused: boolean;
  isFinished: boolean;
  localModel?: LocalModel;
} // eslint-disable-line

export default function HeaderContent({
  isCorrect,
  isIncorrect,
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  localModel,
}: HeaderContentProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const localGameSession = useTSGameSessionContext(LocalGameSessionContext);

  const statePosition = Object.keys(GameSessionState).indexOf(localGameSession.currentState);
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

  const handleTimerAddButtonClick = () => {
    console.log('TimerAddButton clicked!'); // eslint-disable-line
  };

  return (
    <HeaderStackContainerStyled>
      <Container maxWidth="md">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <QuestionIndicator
              totalQuestions={localGameSession.questions.length}
              currentQuestionIndex={localGameSession.currentQuestionIndex}
              statePosition={statePosition}
            />
          </Grid>
          <Grid item>
            <HostPlayerIconContainer>
              <Typography variant="subtitle2">
                {t('gamesession.player')}
              </Typography>
              <img src={playerIcon} alt="Player Icon" />
            </HostPlayerIconContainer>
          </Grid>
        </Grid>
        <Grid item style={{ paddingTop: `${theme.sizing.xxSmPadding}px` }}>
          <Typography variant="h1" style={{ fontSize: '24px', lineHeight: '36px', fontFamily: 'Poppins' }}>
            {stateCheck(localGameSession.currentState, isCorrect, isIncorrect)}
          </Typography>
        </Grid>
        <Grid item style={{display: 'flex', justifyItems: 'space-between', alignItems: 'center', gap: '24px', paddingTop: `${theme.sizing.xSmPadding}px`}}>
              <Timer
                totalTime={totalTime}
                currentTimer={currentTimer}
                isFinished={isFinished}
                isPaused={isPaused}
                localGameSession={localGameSession}
              />
            <TimerAddButton onClick={handleTimerAddButtonClick}>
              <Typography variant="subtitle2" style={{ fontSize: '14px' }}>
                {t('gamesession.addtime')}
              </Typography>
            </TimerAddButton>
        </Grid>
      </Container>
    </HeaderStackContainerStyled>
  );
}
