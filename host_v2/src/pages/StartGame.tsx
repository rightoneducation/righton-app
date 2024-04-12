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

const SafeAreaStyled = styled(Typography)({
  width: '375px',
  height: '731px',
  top: '47px',
  gap: '16px',
});


// const UpperStyled = styled(Box)({
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'flex-start',
//   gap: '36px',
//   marginTop: '30px',
    
// })
const UpperStyled = styled(Box)({
  gap: '16px', 
  width: '375px', 
  height: '170px', //  padding: '0px 16px 0px 16px', WHAT
});

const TopLineStyled = styled(Box)({
  width: '343px', // Figma width
  height: '36px', // Figma height
  padding: '0px 0px 0px 8px', // Figma padding
  gap: '8px', // Figma gap
});


const GameStyled = styled(Typography)({
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'Italic',
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 0.46)',
  paddingTop: '10%',
})


// const GameLobbyStyled = styled(Typography)({
//   fontSize: '24px',
//   fontWeight: 'bold',
//   color: 'rgba(255, 255, 255, 1)',
//   marginBottom: '-45px',
//   paddingTop: '24px',
//   textAlign: 'left', 
// })
const GameLobbyStyled = styled(Typography)({
  width: '255px',
  height: '36px',
  fontSize: '24px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  lineHeight: '36px', // this makes it look better: paddingTop: '24px',
})

const IconStyled = styled(Box)({
  width: '32px', 
  height: '32px', 
});

const HelpSvg = styled(HelpIcon)({
  marginLeft: 'auto', 
});

const CloseSvg = styled(CloseIcon)({
  marginLeft: 'auto', 
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
        <FooterStartGame 
        teamsLength={teams ? teams.length : 0}
        />
        </SafeAreaStyled>
      </BackgroundStyled>
    )

  }
  
  export default StartGame;