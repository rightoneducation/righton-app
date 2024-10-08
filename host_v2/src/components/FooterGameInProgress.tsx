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
import { IGraphClickInfo, ScreenSize } from '../lib/HostModels';

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
  setIsAnimating: (isAnimating: boolean) => void;
  setGraphClickInfo: (graphClickInfo: IGraphClickInfo) => void;
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
  animate3, 
  setIsAnimating,
  setGraphClickInfo
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
        setIsAnimating(true);
        const animations = () => {
          return Promise.all([
            animate(scope.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' }),
            animate2(scope2.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' }),
            animate3(scope3.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' })
          ]);
        };
        await animations();
        setIsAnimating(false);
        break;
      }
      case GameSessionState.TEAMS_JOINING:
        setIsAnimating(true);
        await animate(scope.current, { x: '-100vw' }, { duration: 1, ease: 'easeOut' });
        setIsAnimating(false);
        break;
      default:
        break;
    }
    if ((currentState === GameSessionState.PHASE_1_DISCUSS || currentState ===GameSessionState.PHASE_2_START || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER || currentState === GameSessionState.PHASE_2_DISCUSS)) {
      let currentResponses = apiClients.hostDataManager?.getResponsesForQuestion(id, IPhase.ONE);
      if (currentResponses && currentResponses.length > 0)
        // shuffle the phase 1 responses prior to moving onto phase 2
        if (currentState === GameSessionState.PHASE_2_START){
          setGraphClickInfo({graph: null, selectedIndex: null});
          // for short answer, shuffle responses before sending them on so common mistakes sorted by popularity dont go to play
          if (isShortAnswerEnabled)
            currentResponses = apiClients.hostDataManager?.shuffleSelectedMistakes(currentResponses);
        }
        console.log(apiClients.hostDataManager?.getHostTeamAnswersForQuestion(id));
        await apiClients.question.updateQuestion({id, order, gameSessionId, answerData: JSON.stringify(apiClients.hostDataManager?.getHostTeamAnswersForQuestion(id))});
    }
    dispatch({type: 'synch_local_gameSession', payload: {...localGameSession, currentState: nextState, startTime}});
    apiClients.hostDataManager?.updateGameSession({id: localGameSession.id, currentState: nextState, startTime, sessionData: JSON.stringify(apiClients.hostDataManager.getHostTeamAnswers())});
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
