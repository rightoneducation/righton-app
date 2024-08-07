import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import GameCode from './GameCode';

import { ReactComponent as HelpIcon } from '../images/Help.svg';
import { ReactComponent as CloseIcon } from '../images/Close.svg';

interface HostHeaderProps {
  gameCode: number;
}


const UpperStyled = styled(Box)({
  display: 'flex',
  position: 'sticky',
  flexDirection: 'column',
  justifyContent: 'space-between', 
  gap: '16px', 
  height: '170px', 
  padding: '0px 16px 0px 16px', 
  boxSizing: 'border-box', 
  zIndex: 9999,
});

const TopLineStyled = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between', // send the "game lobby" and the icons to opp sides
  alignItems: 'center', // align items vertically in the center
  width: '100%', // fixed on the figma, but that would look goofy on bigger screens
  padding: '0px 0px 0px 8px', 
  gap: '8px', 
  height: '36px',
});

const GameLobbyTypographyStyled = styled(Typography)({
  width: '255px', // this is for the phase description
  height: '36px',
  fontSize: '24px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  lineHeight: '36px', 
});

const IconsContainer = styled(Box)({
  display: 'flex',
  gap: '8px', 
});

const HelpSvg = styled(HelpIcon)({
  cursor: 'pointer', // So we can click on it
});

const CloseSvg = styled(CloseIcon)({
  marginRight: '8px',
  cursor: 'pointer', 
});

const handleHelpClick = () => {
  console.log("Help Icon clicked");
};

const handleCloseClick = () => {
  console.log("Close Icon clicked");
};


function HostHeader({ gameCode }: HostHeaderProps) {
  return (
    <UpperStyled>
      <TopLineStyled>
        <GameLobbyTypographyStyled>Game Lobby </GameLobbyTypographyStyled>
        <IconsContainer>
          <HelpSvg onClick={handleHelpClick}/>
          <CloseSvg onClick={handleCloseClick}/>
        </IconsContainer>
      </TopLineStyled>
      <GameCode gameCode={gameCode} />
    </UpperStyled>
  );
}

export default HostHeader;

