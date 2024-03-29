import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

interface GameCodeProps {
  gameCode: number;
}

const GameCodeCard = styled(Grid)({
  paddingLeft: '10px',
  paddingRight: '10px',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '8px',
  width: '212px',
  height: '48px',
  margin: 'auto',
  marginTop: '-1%',
  marginBottom: '4%',
  justifyContent: 'center',
})

const GameCodeText = styled(Grid)({
  margin: 'auto',
  justifyContent: 'center',
  fontSize: '28px',
  fontWeight: 'bold',
  color: 'rgba(255, 255, 255, 1)',
})

const GameCodeParagraph = styled(Typography)({
  fontSize: '16px',
  color: 'rgba(255, 255, 255, 1)',
  margin: 'auto',
})

function GameCode({ gameCode }: GameCodeProps) {
  return (
    <GameCodeCard container>
      <GameCodeParagraph>Game Code: </GameCodeParagraph>
      <GameCodeText>{gameCode}</GameCodeText>
    </GameCodeCard>
  );
}
  
  export default GameCode;