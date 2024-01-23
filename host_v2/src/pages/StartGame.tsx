import React, { useEffect, useState } from 'react';
import {Box, Paper} from '@mui/material';
import { styled } from '@mui/material/styles';
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';


interface StartGameProps {
  teams: any[]
  currentQuestionIndex: number
  questions: any[]
  title: string
  gameSessionId: string
  gameCode: string
  currentState: any
  handleStartGame: () => void
}  

const BackgroundStyled = styled(Paper)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
}))

const UpperStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '24px',
    
}))

const GameStyled = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 0.46)',
  paddingTop: '10%',

}))

function StartGame({teams,
  currentQuestionIndex,
  questions,
  title,
  gameSessionId,
  gameCode,
  currentState,
  handleStartGame}: StartGameProps) {
   // const classes= useStyles();

    return (
      <BackgroundStyled>
        <UpperStyled>
          <HostHeader 
          gameCode = {gameCode}
          currentQuestionIndex={currentQuestionIndex}
          />
          <GameCard questions = {questions} title={title} />
          <GameStyled>Basic Mode</GameStyled>
          <CurrentStudents teams={teams}/>
        </UpperStyled>
        <FooterStartGame 
        teamsLength={teams ? teams.length : 0}
        gameSessionId = {gameSessionId}
        currentQuestionIndex={currentQuestionIndex}
        handleStateGame={handleStartGame}
        />
      </BackgroundStyled>
    )

  }

  // const useStyles = makeStyles((theme: Theme) => ({
  //   background: {
  //     display: 'flex',
  //     minHeight: '100vh',
  //     flexDirection: 'column',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  //   },
  //   upperContainer: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     justifyContent: 'flex-start',
  //     alignItems: 'center',
  //     gap: '24px',
  //   },
  //   gameMode: {
  //     textAlign: 'center',
  //     fontWeight: 'bold',
  //     fontStyle: 'italic',
  //     fontSize: '18px',
  //     color: 'rgba(255, 255, 255, 0.46)',
  //     paddingTop: '10%',
  //   },
  // }));
  
  export default StartGame;