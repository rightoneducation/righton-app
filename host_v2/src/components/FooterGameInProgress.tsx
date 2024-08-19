import React, { useContext } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState, IHostTeamAnswersPerPhase, IPhase } from '@righton/networking';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import ProgressBarGroup from './ProgressBarGroup';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { ScreenSize } from '../lib/HostModels';

const ButtonStyled = styled(Button)({
  border: '2px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '22px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px #47D9FF 30%',
  '&:disabled': {
    background: '#032563',
    border: '2px solid #159EFA',
    borderRadius: '22px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: '100%',
    cursor: 'not-allowed',
    boxShadow: '0px 5px 22px 0px #47D9FF 30%',

  },
});

const FooterContainer = styled(Box)(({theme}) => ({
  position: 'sticky',
  bottom: '0',
  margin: 'auto',
  width: '100%',
  maxWidth: '700px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '16px 16px 24px',
  boxSizing: 'border-box'
}));

const InnerFooterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  gap: 16
});

interface FootGameInProgressProps {
  currentState: GameSessionState;
  submittedAnswers: number;
  teamsLength: number;
  screenSize: ScreenSize;
  scope: any;
  animate: any;
  scope2: any;
  animate2: any;
  scope3: any;
  animate3: any;
}

function FooterGameInProgress({
  currentState,
  submittedAnswers,
  teamsLength,
  screenSize,
  scope,
  animate,
  scope2,
  animate2,
  scope3,
  animate3
}: FootGameInProgressProps) {
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(GameSessionContext);
  const { id, order, gameSessionId, isShortAnswerEnabled } = localGameSession.questions[localGameSession.currentQuestionIndex];
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);
  const handleButtonClick = async () => {
    const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
    const startTime = Date.now(); 
    switch (nextState) {
      case GameSessionState.FINAL_RESULTS:{
        const animations = () => {
          return Promise.all([
            animate(scope.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' }),
            animate2(scope2.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' }),
            animate3(scope3.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' })
          ]);
        };
        await animations();
        break;
      }
      case GameSessionState.TEAMS_JOINING:
        await animate(scope.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' });
        break;
      default:
        break;
    }
    if (nextState === GameSessionState.CHOOSE_TRICKIEST_ANSWER && isShortAnswerEnabled) {
      const currentResponses = apiClients.hostDataManager?.getResponsesForQuestion(id, IPhase.ONE);
      apiClients.question.updateQuestion({id, order, gameSessionId, responses: JSON.stringify(currentResponses)});
    }
    apiClients.gameSession.updateGameSession({id: localGameSession.id, currentState: nextState, startTime: startTime.toString()});
    dispatch({type: 'advance_game_phase', payload: {nextState, startTime}});
  };
  const GetButtonText = () => {
    switch(currentState) {
      case GameSessionState.CHOOSE_CORRECT_ANSWER:
      case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
        return 'End Answering';
      case GameSessionState.PHASE_2_START:
        return 'Continue to Phase Two';
      case GameSessionState.PHASE_1_DISCUSS:
      case GameSessionState.PHASE_2_DISCUSS:
        return 'Continue';
      default:
        return 'Start Game';
    }
  }
  const buttonText = GetButtonText();
  return (
    <FooterContainer>
      <InnerFooterContainer>
        { (screenSize === ScreenSize.SMALL || (screenSize === ScreenSize.MEDIUM && (isShortAnswerEnabled || localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS))) && (
          <PaginationContainerStyled
            className="swiper-pagination-container"
            style={{ paddingTop: `${theme.sizing.xxSmPadding}px`, zIndex: 2 }}
          />
        )}
        { (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) &&
          <ProgressBarGroup submittedAnswers={submittedAnswers} teamsLength={teamsLength} />
        }
        <ButtonStyled disabled={teamsLength <= 0} onClick={handleButtonClick}>{buttonText}</ButtonStyled>
      </InnerFooterContainer>
    </FooterContainer>
  );
}

export default FooterGameInProgress;
