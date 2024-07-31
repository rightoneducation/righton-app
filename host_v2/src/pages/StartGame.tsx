import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import {
  ITeam,
  IQuestion,
  IHostTeamAnswers,
  GameSessionState
} from '@righton/networking';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../lib/context/LocalGameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useLocalGameSessionContext';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';

const BackgroundStyled = styled(Paper)({
  minHeight: '100vh',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
})

const SafeAreaStyled = styled(Box)({
  paddingTop: '47px',
  paddingBottom: '34px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
});

interface StartGameProps {
  teams: ITeam[];
  questions:IQuestion[];
  title: string;
  gameCode: number;
  currentQuestionIndex: number;
  handleDeleteTeam: (id: string) => void;
  setLocalHostTeamAnswers: (value: IHostTeamAnswers) => void;
}  

function StartGame({teams,
  questions,
  title,
  gameCode,
  currentQuestionIndex,
  handleDeleteTeam,
  setLocalHostTeamAnswers
  }: StartGameProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const localGameSession = useTSGameSessionContext(LocalGameSessionContext);
    const dispatch = useTSDispatchContext(LocalGameSessionDispatchContext);   

    const handleButtonClick = () => {
      const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
      if (localGameSession.currentQuestionIndex === null){
        const updateNoResponses = apiClients.hostDataManager?.initHostTeamAnswers();
        if (updateNoResponses && setLocalHostTeamAnswers)
          setLocalHostTeamAnswers(updateNoResponses);
        dispatch({type: 'begin_game', payload: {nextState, currentQuestionIndex: 0}});
        apiClients.gameSession.updateGameSession({id: localGameSession.id, currentQuestionIndex: 0, currentState: nextState})
      } else {
        const nextQuestionIndex = localGameSession.currentQuestionIndex + 1;
        dispatch({type: 'advance_game_phase', payload: {nextState, currentQuestionIndex: nextQuestionIndex}});
        apiClients.gameSession.updateGameSession({id: localGameSession.id, currentQuestionIndex: nextQuestionIndex, currentState: nextState})
      }
    }

    return (
        <SafeAreaStyled>
          <HostHeader gameCode = {gameCode} />
          <HostBody 
            teams={teams} 
            questions={questions} 
            title={title} 
            currentQuestionIndex={currentQuestionIndex}
            handleDeleteTeam={handleDeleteTeam} 
            screenSize={screenSize}
          />
          <FooterStartGame 
            localGameSession={localGameSession}
            teamsLength={teams ? teams.length : 0}
            screenSize={screenSize}
            handleButtonClick={handleButtonClick}
          />
        </SafeAreaStyled>
    )
  }
  
  export default StartGame;