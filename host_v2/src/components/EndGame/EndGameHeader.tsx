import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';
import GameEndedGameCode from './EndGameGameCode';
import { ReactComponent as HelpIcon } from '../../images/Help.svg';
import { ReactComponent as CloseIcon } from '../../images/Close.svg';

interface GameEndedHostHeaderProps {
  gameCode: number;
}

const UpperStyled = styled(Box)(({theme}) => ({
  display: 'flex',
  position: 'sticky',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center', 
  gap: '16px', /* this is for Header / Lobby */
  height: '86px', 
  width: '100%',
  padding: '0px 16px 0px 16px', 
  boxSizing: 'border-box', /* got rid of width, added the display, flexdir, justify content */
  zIndex: 2,
  maxWidth: `${theme.breakpoints.values.lg}px`,
  marginBottom: '16px',
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


function GameEndedHostHeader({ gameCode }: GameEndedHostHeaderProps) {
  return (
    <UpperStyled>
      <TopLineStyled>
        <GameLobbyTypographyStyled>Game End Lobby </GameLobbyTypographyStyled>
        <IconsContainer>    
          <HelpSvg onClick={handleHelpClick}/>
          <CloseSvg onClick={handleCloseClick}/>
        </IconsContainer>
      </TopLineStyled>
      <GameEndedGameCode gameCode={gameCode} />
    </UpperStyled>
  );
}

export default GameEndedHostHeader;

