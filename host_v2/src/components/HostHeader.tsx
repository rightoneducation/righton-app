import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import GameCode from './GameCode';


interface HostHeaderProps{
    gameCode: number;
}

const ClearIconGameCodeStyled = styled(Box)(({ theme }) => ({
  color: 'white',
  display: 'block',
  padding: `${theme.spacing(4)}`,
}));

const GameLobbyStyled = styled(Typography)({
  width: '255px',
  height: '36px',
  fontSize: '24px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  lineHeight: '36px', // this makes it look better: paddingTop: '24px',
})
function HostHeader({ gameCode }: HostHeaderProps) {
    return (
      <ClearIconGameCodeStyled>
        <GameLobbyStyled> Hellooooooo</GameLobbyStyled>
        <GameCode gameCode = {gameCode} 
        />
      </ClearIconGameCodeStyled>
    )
}

export default HostHeader;
