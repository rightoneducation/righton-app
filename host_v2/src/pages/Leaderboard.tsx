import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { ITeam, IQuestion, GameSessionState } from '@righton/networking';
import {motion} from 'framer-motion';
import { getNextGameSessionState } from '../lib/HelperFunctions';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSGameSessionContext, useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import LeaderboardHeader from '../components/LeaderboardHeader';
import FooterInterim from '../components/FooterInterim';
import HostBody from '../components/HostBody';

interface LeaderboardProps {
  teams: ITeam[];
  questions:IQuestion[];
  currentQuestionIndex: number;
  title: string;
}
const Shadow = styled(Box)(({theme}) => ({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100vw', // Stretch across the entire container
  height: '100vh', // Cover the full height of the container
  boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
  zIndex: -1,
}));

const SafeAreaStyled = styled(Box)(({ theme }) => ({
  paddingBottom: '34px',
  width: '100%',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
  overflow: 'hidden'
}));
const BackgroundStyled = styled(Paper)(({ theme }) => ({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100vw', // Stretch across the entire container
  height: '100vh', // Cover the full height of the container
  background: theme.palette.primary.backgroundGradient,
  zIndex: -1, // Ensure it stays behind the content
  overflow: 'hidden',
  boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',

}));
const getScaleFactor = () => {
  return 225 / window.innerHeight;
}
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
  const handleButtonClick = async () => {
    const nextState = getNextGameSessionState(localGameSession.currentState, localGameSession.questions.length, localGameSession.currentQuestionIndex);
    dispatch({type: 'synch_local_gameSession', payload: {...localGameSession, currentQuestionIndex:  localGameSession.questions.length-1 > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex, currentState: nextState}});
    apiClients.hostDataManager?.updateGameSession({id: localGameSession.id, currentState: nextState, currentQuestionIndex: localGameSession.questions.length-1 > localGameSession.currentQuestionIndex ? localGameSession.currentQuestionIndex + 1 : localGameSession.currentQuestionIndex});
  };
  return(
    <SafeAreaStyled>
      <motion.div
        initial={{ scaleY: getScaleFactor() }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      >
        <BackgroundStyled />
      </motion.div>
      <motion.div
        initial={{ y: 'calc(-100vh + 225px)'}}
        animate={{ y: '0px'}}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', // to not affect other elements
          width: '100%',
          top: 0, 
          left: 0, 
          zIndex: -1,
          transform: 'translateY(-100%)',
        }}
      >
        <Shadow />
      </motion.div>
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '0', opacity: 1 }}
        transition={{ duration: 1.5, delay: .5 }}
        style={{ width: '100%', zIndex: 0 , display: 'flex', justifyContent: 'center',}}
      >
        <LeaderboardHeader />
      </motion.div>

      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '0', opacity: 1 }}
        transition={{ duration: 1.5, delay: .5 }}
        style={{ width: '100%', height: '100%', zIndex: 0 , display: 'flex', justifyContent: 'center', overflow: 'hidden', flexGrow: 1}}
      >
        <HostBody
          teams={teams}
          questions={questions}
          title={title}
          currentQuestionIndex={currentQuestionIndex}
          screenSize={screenSize}
        />
      </motion.div>

      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}
        animate={{ y: '0', opacity: 1 }}
        transition={{ duration: 1.5, delay: .5 }}
        style={{   
          position: 'sticky',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          bottom: '0',
          width: '100%',
          height: '90px'
        }}
      >
        <Box style={{bottom: '0', marginTop: 'auto', }}>
        <FooterInterim
          teamsLength={teams ? teams.length : 0}
          screenSize={screenSize}
          handleButtonClick={handleButtonClick}
          isGamePrepared={false}
        />
        </Box>
      </motion.div>
    </SafeAreaStyled>
  );
}