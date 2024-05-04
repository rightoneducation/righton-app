
import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography, Box } from '@mui/material';

interface GameEndedGameCodeProps {
  gameCode: number;
}

const GameCodeCard = styled(Box)({
    padding: '8px 12px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    width: '151px',
    height: '34px',
    gap: '8px', 
    margin: 'auto', /* added this */
    boxSizing: 'border-box',
    display: 'flex', 
    flexdirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
});

const GameCodeText = styled(Typography)({
  fontSize: '18px', /* for 2409 > title */
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  // border: '1px solid rgba(255, 255, 255, 0.25)',
  textAlign: 'center' 
});

const GameCodeParagraph = styled(Typography)({
  fontFamily: 'Rubik',
  fontSize: '14px', /* for frame 2409 > description */
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '400',
  lineHeight: '16.59px',

});

function GameEndedGameCode({ gameCode }: GameEndedGameCodeProps) {
  return (
    <GameCodeCard container>
      {/* <div style={{ textAlign: 'center' }}> */}
        <GameCodeParagraph>Game Code</GameCodeParagraph>
        <GameCodeText>{gameCode}</GameCodeText>
      {/* </div> */}
    </GameCodeCard>
  );
}
  
export default GameEndedGameCode;
