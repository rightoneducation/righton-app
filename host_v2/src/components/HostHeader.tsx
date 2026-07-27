import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { ScreenSize } from '../lib/HostModels';
import GameCode from './GameCode';
import HelpModal from './HelpModal';
import { ReactComponent as HelpIcon } from '../images/Help.svg';
import { ReactComponent as CloseIcon } from '../images/Close.svg';

interface HostHeaderProps {
  gameCode: number;
  screenSize: ScreenSize;
}


const UpperStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({theme, screenSize}) => ({
  display: 'flex',
  position: 'sticky',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: screenSize === ScreenSize.LARGE ? '8px' : '24px',
  width: '100%',
  maxWidth: `${theme.breakpoints.values.lg}px`,
  margin: '0 auto',
  paddingTop: '40px',
  paddingLeft: screenSize === ScreenSize.MEDIUM ? '32px' : '24px',
  paddingRight: screenSize === ScreenSize.MEDIUM ? '32px' : '24px',
  boxSizing: 'border-box',
  zIndex: 3,
}));

const TopLineStyled = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between', // send the "game lobby" and the icons to opp sides
  alignItems: 'center', // align items vertically in the center
  width: '100%', 
  gap: '8px', 
  height: '36px',
});

const GameLobbyTypographyStyled = styled(Typography)({
  width: '255px', 
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

function HostHeader({ gameCode, screenSize }: HostHeaderProps) {
  const theme = useTheme();
  
  const [isHelpDisplayed, setIsHelpDisplayed] = useState<boolean>(false);
  const handleHelpClick = () => {
    setIsHelpDisplayed(true);
  };
  
  const handleCloseClick = () => {
    window.location.href = 'http://dev-central.rightoneducation.com/';
  };
  return (
    <Box style={{width: '100%'}}>
      <UpperStyled screenSize={screenSize}>
        {isHelpDisplayed && 
          <HelpModal isHelpDisplayed={isHelpDisplayed} setIsHelpDisplayed={setIsHelpDisplayed}/>
        }
        <TopLineStyled>
            <GameLobbyTypographyStyled
              style={{fontSize: screenSize !== ScreenSize.LARGE ? '24px' : '32px'}}
            >
              Game Lobby
            </GameLobbyTypographyStyled> 
            <Box>
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
            </Box>
        </TopLineStyled>
        <GameCode gameCode={gameCode} screenSize={screenSize} />
      </UpperStyled>
    </Box>
  );
}

export default HostHeader;

