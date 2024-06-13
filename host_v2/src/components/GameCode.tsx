
import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

interface GameCodeProps {
  gameCode: number;
}

const GameCodeCard = styled(Grid)({
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '16px',
  width: '230px',
  height: '118px',
  gap: '12px', 
  margin: 'auto', /* added this */
  justifyContent: 'center', /* added this */
});

const GameCodeText = styled(Typography)({
  fontSize: '72px', /* for 2409 > title */
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  marginTop: '32px',
  width: '181px',
  height: '57',
});

const GameCodeParagraph = styled(Typography)({
  fontFamily: 'Rubik',
  fontSize: '14px', /* for frame 2409 > description */
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '400',
  lineHeight: '16.59px',
});

function GameCode({ gameCode }: GameCodeProps) {
  return (
    <GameCodeCard container>
      <div style={{ textAlign: 'center' }}>
        <GameCodeParagraph>Game Code</GameCodeParagraph>
        <GameCodeText>{gameCode}</GameCodeText>
      </div>
    </GameCodeCard>
  );
}
  
export default GameCode;
