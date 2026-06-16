
import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import { ScreenSize } from '../lib/HostModels';

interface GameCodeProps {
  gameCode: number;
  screenSize: ScreenSize;
}

const GameCodeCard = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ screenSize }) => ({
  width: screenSize === ScreenSize.SMALL ? '100%' : 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
  paddingLeft:  screenSize === ScreenSize.LARGE ? '24px' : '88px',
  paddingRight: screenSize === ScreenSize.LARGE ? '24px' : '88px',
  paddingBottom: '16px',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '16px',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center', // center children on the cross axis so the fixed-width code sits centered in the box
}));

const GameCodeText = styled(Typography)({
  fontSize: '72px', /* for 2409 > title */
  lineHeight: '72px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  width: '181px',
  textAlign: 'center'
});

const GameCodeParagraph = styled(Typography)({
  fontFamily: 'Rubik',
  fontSize: '14px', /* for frame 2409 > description */
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '400',
  lineHeight: '14px',
  textAlign: 'center'
});

function GameCode({ gameCode, screenSize }: GameCodeProps) {
  return (
    <GameCodeCard container screenSize={screenSize}>
      <GameCodeParagraph>Game Code</GameCodeParagraph>
      <GameCodeText>{gameCode}</GameCodeText>
    </GameCodeCard>
  );
}
  
export default GameCode;
