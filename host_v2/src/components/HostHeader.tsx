import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import GameCode from './GameCode';



interface HostHeaderProps{
    gameCode: number;
}

const ClearIconGameCodeStyled = styled(Box)(({ theme }) => ({
  color: 'white',
  display: 'block',
  padding: `${theme.spacing(4)}`,
}));

function HostHeader({ gameCode }: HostHeaderProps) {
    return (
      <ClearIconGameCodeStyled>
        <GameCode gameCode = {gameCode} 
        />
      </ClearIconGameCodeStyled>
    )
}

export default HostHeader;
