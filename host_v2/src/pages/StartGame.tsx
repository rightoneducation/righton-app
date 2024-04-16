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

import { ReactComponent as HelpIcon } from './images/Help.svg';
import { ReactComponent as CloseIcon } from './images/Close.svg';


interface StartGameProps {
  teams: ITeam[]
  questions:IQuestion[]
  title: string
  gameCode: number
}  

const BackgroundStyled = styled(Paper)({
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)'
})

const SafeAreaStyled = styled(Box)({
  marginTop: '47px',
  marginBottom: '34px',
  width: '375px',
  height: '731px',
  gap: '16px',
});

function StartGame({teams,
  questions,
  title,
  gameCode,
  }: StartGameProps) {
    return (
      <BackgroundStyled>
        <SafeAreaStyled>
          <HostHeader gameCode = {gameCode} />
          <CurrentStudents teams={teams}/>
          <FooterStartGame 
          teamsLength={teams ? teams.length : 0}
          />
        </SafeAreaStyled>
      </BackgroundStyled>
    )

  }
  
  export default StartGame;