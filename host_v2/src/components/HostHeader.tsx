import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import GameCode from './GameCode';

import { ReactComponent as HelpIcon } from '../images/Help.svg';
import { ReactComponent as CloseIcon } from '../images/Close.svg';


interface HostHeaderProps{
    gameCode: number;
}

const ClearIconGameCodeStyled = styled(Box)(({ theme }) => ({
  color: 'white',
  display: 'block',
  padding: `${theme.spacing(4)}`,
  gap: '16px',  /* this is for Header / Lobby */
  }));

const UpperStyled = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Align items with space between
  gap: '16px', /* this is for Header / Lobby */
  height: '170px', 
  padding: '0px 16px 0px 16px', /* WHY IS IT WEIRD */
  boxSizing: 'border-box',
});

// const TopLineStyled = styled(Box)({
//   width: '343px', /* this is for the frame 2410 */
//   height: '36px', 
//   padding: '0px 0px 0px 8px', 
//   gap: '8px', 
// });
const TopLineStyled = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center', // Align items vertically in the center
  width: '100%', // Take up the full width of the container
  padding: '0px 0px 0px 8px', // Adjust padding as needed
  gap: '8px',
});
const GameLobbyTypographyStyled = styled(Typography)({
  width: '255px', /* this si for the phase description */
  height: '36px',
  fontSize: '24px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 1)',
  lineHeight: '36px', /* this makes it look better: paddingTop: '24px', */
})

const IconStyled = styled(Box)({
  width: '32px', /* this si for header icons / help / close */
  height: '32px', 
});

const HelpSvg = styled(HelpIcon)({
});

const IconsContainer = styled(Box)({
  display: 'flex',
  gap: '8px', // Adjust the gap between icons if needed
});

const CloseSvg = styled(CloseIcon)({
  marginRight: '8px',
});

function HostHeader({ gameCode }: HostHeaderProps) {
    return (
        <UpperStyled>
          <TopLineStyled>
            <GameLobbyTypographyStyled>Game Lobby </GameLobbyTypographyStyled>
            <IconsContainer>
              <HelpSvg/> <CloseSvg/>
            </IconsContainer>
          </TopLineStyled>
          <GameCode gameCode = {gameCode} 
          />  
        </UpperStyled>
    )
}

export default HostHeader;
