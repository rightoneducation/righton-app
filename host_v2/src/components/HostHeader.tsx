import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import GameCode from './GameCode';
import { ReactComponent as HelpIcon } from '../images/Help.svg';
import { ReactComponent as CloseIcon } from '../images/Close.svg';

interface HostHeaderProps {
  gameCode: number;
}


const UpperStyled = styled(Box)(({theme}) => ({
  display: 'flex',
  position: 'sticky',
  flexDirection: 'column',
  justifyContent: 'space-between', 
  gap: '16px', /* this is for Header / Lobby */
  height: '170px', 
  width: '100%',
  maxWidth: `${theme.breakpoints.values.lg}px`,
  padding: '0px 16px 0px 16px', 
  boxSizing: 'border-box', /* got rid of width, added the display, flexdir, justify content */
  zIndex: 3,
}));

const TopLineStyled = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between', // send the "game lobby" and the icons to opp sides
  alignItems: 'center', // align items vertically in the center
  width: '100%', // fixed on the figma, but that would look goofy on bigger screens
  padding: '0px 0px 0px 8px', // Adjust padding as needed
  gap: '8px', /* changed the width to 100%, added the display, justify, and align */
  height: '36px',
});

const GameLobbyTypographyStyled = styled(Typography)({
  width: '255px', /* this si for the phase description */
  height: '36px',
  fontSize: '24px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  lineHeight: '36px', /* same everything */
});

const IconsContainer = styled(Box)({
  display: 'flex',
  gap: '8px', // Adjust the gap between icons if needed
});

const HelpSvg = styled(HelpIcon)({
  cursor: 'pointer', // Set cursor to pointer
});

const CloseSvg = styled(CloseIcon)({
  marginRight: '8px',
  cursor: 'pointer', // Set cursor to pointer
});

const handleHelpClick = () => {
  console.log("Help Icon clicked");
};

const handleCloseClick = () => {
  console.log("Close Icon clicked");
};


function HostHeader({ gameCode }: HostHeaderProps) {
  const theme = useTheme();
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

