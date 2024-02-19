import React, { useEffect, useState } from 'react';
import {Box, Paper, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ITeam,
  IQuestion,
  GameSessionState
} from '@righton/networking';
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';


interface StartGameProps {
  teams: ITeam[]
  currentQuestionIndex: number
  questions:IQuestion[]
  title: string
  gameSessionId: string
  gameCode: number
  currentState: GameSessionState
  handleStartGame: () => void
}  

const BackgroundStyled = styled(Paper)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)'
}))

const UpperStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '24px',
    
}))

const GameStyled = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'Italic',
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
  
  export default StartGame;