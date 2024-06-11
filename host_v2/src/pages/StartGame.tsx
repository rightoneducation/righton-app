import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ITeam,
  IQuestion,
} from '@righton/networking';
import { motion } from "framer-motion";

import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';

interface StartGameProps {
  teams: ITeam[]
  questions:IQuestion[]
  title: string
  gameCode: number
  scope: React.RefObject<HTMLDivElement>
  scope2: React.RefObject<HTMLDivElement>
  scope3: React.RefObject<HTMLDivElement>
  scope4: React.RefObject<HTMLDivElement>
  handleStartGame: () => void
}  

const BackgroundStyled = styled(Paper)({
  position: 'absolute', // Position it absolutely within StartGameContainer
  top: 0,
  left: 0,
  width: '100%', // Stretch across the entire container
  height: '100vh', // Cover the full height of the container
  display: 'flex',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  zIndex: -1, // Ensure it stays behind the content
})

const UpperStyled = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '24px',    
  height: '100%'
    
})

const GameStyled = styled(Typography)({
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'Italic',
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 0.46)',
  paddingTop: '10%',
})

const StartGameContainer = styled(Box)(({ theme }) => ({
  position: 'relative', 
  height: '100vh',
  overflowX: 'hidden'
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  overflowY: 'auto', // Enable vertical scrolling
  msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
  scrollbarWidth: 'none', // Hide scrollbar for Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
  },
  height: 'calc(100vh - 80px)', // Adjust the height to prevent overflow, consider header or other elements if present
  zIndex: 1,

}))

function StartGame({teams,
  questions,
  title,
  gameCode,
  scope,
  scope2,
  scope3,
  scope4, 
  handleStartGame
  }: StartGameProps) {
    return (
      <StartGameContainer>
        <motion.div ref={scope} exit={{ y: `calc(100vh - 500px)`}}> 
          <BackgroundStyled /> 
        </motion.div>
        <ContentContainer>
            <motion.div ref={scope2} exit={{opacity: 0}} style={{height: 'calc(100vh - 80px)'}}>
              <UpperStyled>
                <HostHeader 
                  gameCode = {gameCode}
                  // currentQuestionIndex={currentQuestionIndex}
                />
                <GameCard questions = {questions} title={title} />
                <GameStyled>Basic Mode</GameStyled>
                <CurrentStudents teams={teams}/>
              </UpperStyled>
            </motion.div>

         </ContentContainer>
         <motion.div ref={scope4} exit={{opacity: 0}}>
          <FooterStartGame 
              teamsLength={teams ? teams.length : 0}
              // gameSessionId = {gameSessionId}
              // currentQuestionIndex={currentQuestionIndex}
              scope3={scope3}
              handleStateGame={handleStartGame}
            />
          </motion.div>
      </StartGameContainer>
    )

  }
  
  export default StartGame;