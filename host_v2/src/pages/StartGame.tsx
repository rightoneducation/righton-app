import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ITeam,
  IQuestion,
} from '@righton/networking';
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';

interface StartGameProps {
  teams: ITeam[]
  questions:IQuestion[]
  title: string
  gameCode: number
}  

const BackgroundStyled = styled(Paper)({
  // display: 'flex',
  minHeight: '100vh',
  // flexDirection: 'column',
  // justifyContent: 'space-between',
  // alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
})

const SafeAreaStyled = styled(Box)({
  paddingTop: '47px',
  paddingBottom: '34px',
  // width: '375px',
  width: '100%',
  height: '100vh',
  // gap: '16px',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
});


const BodyStyled = styled(Box)({
  height: '437px',
});

function StartGame({teams,
  questions,
  title,
  gameCode,
  }: StartGameProps) {
    return (
      
        <SafeAreaStyled>
          <HostHeader gameCode = {gameCode} />
          <HostBody teams={teams}/>
            {/* <CurrentStudents teams={teams}/> */ }
          <FooterStartGame 
          teamsLength={teams ? teams.length : 0}
          />
        </SafeAreaStyled>
    )

  }
  
  export default StartGame;