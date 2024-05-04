import React, { useState } from 'react';
import {Box, Paper, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ITeam,
  IQuestion,
} from '@righton/networking';
import GameEndedHostHeader from '../components/GameEndedHostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';
import GameEndedHostBody from '../components/GameEndedHostBody';
import FooterGameEnded from '../components/FooterGameEnded';

interface TestTeamProp{
  name: string
}
interface GameEndedProps {
  teams: TestTeamProp[]
  questions:IQuestion[]
  title: string
  gameCode: number
}  

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
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
});

function GameEnded({teams,
  questions,
  title,
  gameCode,
  }: GameEndedProps) {
    const [isGameSelected, setIsGameSelected] = useState(false)
    return (
        <SafeAreaStyled>
          <GameEndedHostHeader gameCode = {gameCode} />
          <GameEndedHostBody teams={teams} isGameSelected = {isGameSelected} setIsGameSelected ={setIsGameSelected}/>
          <FooterGameEnded 
          teamsLength={teams ? teams.length : 0}
          isGameSelected = {isGameSelected}
          />
        </SafeAreaStyled>
    )

  }
  
  export default GameEnded;