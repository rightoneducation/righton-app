import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { useAnimate, motion } from 'framer-motion';
import { ITeam, IQuestion, GameSessionState } from '@righton/networking';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import { ScreenSize } from '../lib/HostModels';
import LeaderboardHeader from '../components/LeaderboardHeader';
import FooterInterim from '../components/FooterInterim';
import HostBody from '../components/HostBody';

interface InterimLeaderboardProps {
  teams: ITeam[];
  questions:IQuestion[];
  currentQuestionIndex: number;
  title: string;
  scope: any;
  animate: any;
}

const SafeAreaStyled = styled(Box)(({ theme }) => ({
  // paddingBottom: '34px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  gap: '16px',
  overflow: 'hidden',
}));
const InterimHeader =  styled(Stack)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    paddingTop: `${theme.sizing.mdPadding}px`,
    background: theme.palette.primary.backgroundGradient,
    border: 'none',
    width: '100vw',
    height: `200px`,
    zIndex: -1,
    boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',

  }));

export default function InterimLeaderboard({
 teams,
 questions,
 currentQuestionIndex,
 title,
 scope,
 animate
}: InterimLeaderboardProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(GameSessionContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);  

  const handleButtonClick = async () => {
    const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
    dispatch({type: 'synch_local_gameSession', payload: {...localGameSession, currentQuestionIndex:  localGameSession.questions.length > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex, currentState: nextState}});
    apiClients.gameSession.updateGameSession({id: localGameSession.id, currentState: nextState, currentQuestionIndex: localGameSession.questions.length > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex});
  };
  
  return(
    <SafeAreaStyled>
      <InterimHeader/>
      <LeaderboardHeader />
      <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeIn' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center'}}
        >
      <HostBody 
        teams={teams} 
        questions={questions} 
        title={title} 
        currentQuestionIndex={currentQuestionIndex}
        screenSize={screenSize}
      />
      </motion.div>
      <Box style={{bottom: '0', marginTop: 'auto'}}>
        <FooterInterim
          teamsLength={teams ? teams.length : 0}
          screenSize={screenSize}
          handleButtonClick={handleButtonClick}
          isGamePrepared={false}
        />
        </Box>
    </SafeAreaStyled>
  );
}
