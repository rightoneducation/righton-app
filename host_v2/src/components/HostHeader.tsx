import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import GameCode from './GameCode';
import HelpModal from './HelpModal';
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
  gap: '16px', 
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

function HostHeader({ gameCode }: HostHeaderProps) {
  const theme = useTheme();
  const [isHelpDisplayed, setIsHelpDisplayed] = useState<boolean>(false);
  const handleHelpClick = () => {
    setIsHelpDisplayed(true);
  };
  
  const handleCloseClick = () => {
    window.location.href = 'http://dev-central.rightoneducation.com/';
  };
  return (
    <UpperStyled>
        {isHelpDisplayed && 
        <HelpModal isHelpDisplayed={isHelpDisplayed} setIsHelpDisplayed={setIsHelpDisplayed}/>
      }
      <TopLineStyled>
        <Box>
          <Typography variant="body1" style={{fontSize: 10, color: 'white'}}>QA Version 1.0</Typography>
          <GameLobbyTypographyStyled>Game Lobby </GameLobbyTypographyStyled> 
        </Box>
        <IconsContainer>
        <Tooltip
              title="Help"
              placement="top"
              arrow
              enterTouchDelay={0}
              leaveTouchDelay={300}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -12],
                      },
                    },
                  ],
                },
              }}
            >
          <HelpSvg onClick={handleHelpClick}/>
        </Tooltip>
        <Tooltip
              title="Return to Central"
              placement="top"
              arrow
              enterTouchDelay={0}
              leaveTouchDelay={300}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -12],
                      },
                    },
                  ],
                },
              }}
            >
          <CloseSvg onClick={handleCloseClick}/>
        </Tooltip>
        </IconsContainer>
      </TopLineStyled>
      <GameCode gameCode={gameCode} />
    </UpperStyled>
  );
}

export default HostHeader;

