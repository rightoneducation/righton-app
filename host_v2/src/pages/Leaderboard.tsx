import React, { useState } from 'react';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { ITeam, IQuestion } from '@righton/networking';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import LeaderboardHeader from '../components/LeaderboardHeader';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';

interface LeaderboardProps {
  teams: ITeam[];
  questions:IQuestion[];
  currentQuestionIndex: number;
  title: string;
}

const SafeAreaStyled = styled(Box)((theme) => ({
  paddingTop: `10px`,
  paddingBottom: '34px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px'
}));

export default function Leaderboard({
 teams,
 questions,
 currentQuestionIndex,
 title
}: LeaderboardProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(GameSessionContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);  
  const handleButtonClick = () => {
    const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
    dispatch({type: 'synch_local_gameSession', payload: {...localGameSession, currentQuestionIndex:  localGameSession.questions.length > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex, currentState: nextState}});
    apiClients.gameSession.updateGameSession({id: localGameSession.id, currentState: nextState, currentQuestionIndex: localGameSession.questions.length > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex});
  };
  return(
    <SafeAreaStyled style={{ 
      paddingLeft: `${theme.sizing.xLgPadding}px`,
      paddingRight: `${theme.sizing.xLgPadding}px`
      }}
    >
      <LeaderboardHeader />
      <HostBody 
        teams={teams} 
        questions={questions} 
        title={title} 
        currentQuestionIndex={currentQuestionIndex}
        screenSize={screenSize}
      />
      <FooterStartGame 
        teamsLength={teams ? teams.length : 0}
        screenSize={screenSize}
        handleButtonClick={handleButtonClick}
        isGamePrepared={false}
      />
    </SafeAreaStyled>
  );
}
