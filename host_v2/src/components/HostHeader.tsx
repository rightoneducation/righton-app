import React from 'react';
import { styled } from '@mui/material/styles';
import { Box} from '@mui/material';
import GameCode from './GameCode';



interface HostHeaderProps{
    gameCode: number;
    currentQuestionIndex: number;
}


const ClearIconGameCodeStyled = styled(Box)(({ theme }) => ({
  clearIconGameCode: {
    color: 'white',
    position: 'absolute',
    padding: '3%',
    marginLeft: '3%',
  },
}))



function HostHeader({ gameCode, currentQuestionIndex }: HostHeaderProps) {
    return (
      <Box style= {{padding: '8%'}}>
        <ClearIconGameCodeStyled>
          <GameCode gameCode = {gameCode} 
          />
        </ClearIconGameCodeStyled>
      </Box>
    )
}


export default HostHeader;
