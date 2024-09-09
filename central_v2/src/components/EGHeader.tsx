import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Typography, Collapse, IconButton } from '@mui/material';
import rightonlogo from '../images/rightonlogo.svg';
import dice from '../images/Dice.svg';
import qmarks from '../images/qmarks.svg';
import books from '../images/books.svg';
import profile from '../images/profileplaceholder.svg';
import hamburger from '../images/hamburger.svg';
import hamburgerX from '../images/hamburgerX.svg';
import plus from '../images/plus.svg';
import { ScreenSize } from '../lib/HostModels';
import { Screen } from '../lib/ScreenEnums';

interface EGHeaderProps {
    screenSize: ScreenSize;
    isXLScreen: boolean;
    onScreenChange: (newScreen: Screen) => void; // Pass the screen change handler
  }

interface EGHeaderContainerProps {
  screenSize: ScreenSize;
  menuOpen: boolean;
}

const EGHeaderContainer = styled(Box)<EGHeaderContainerProps>(({ screenSize, menuOpen }) => ({
    height: screenSize === ScreenSize.SMALL ? '77px' : '94px', 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    background: 'linear-gradient(360deg, #02215F 0%, #0D68B1 100%)',
    padding: '16px 32px 16px 32px',
    boxSizing: 'border-box',
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'height 0.5s ease-in-out, background 0.5s ease-in-out', // Smooth transition
  }));

const MenuContainer = styled(Box)({
  position: 'absolute',
  top: '100%', // Position the menu just below the header
  left: 0,
  right: 0,
  backgroundColor: '#02215F',
  zIndex: 1100, // Ensure the menu has a higher z-index
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '16px',
});

const TransparentButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  background: 'transparent',
  color: '#FFFFFF',
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '30px',
  textAlign: 'center',
  textTransform: 'none',
  '& img': {
    marginRight: '8px', // Space between icon and text
  },
});

const PrimaryButton2 = styled(Button)(() => ({
  width: '123px',
  minWidth: '44px',
  height: '38px',
  padding: '4px 12px',
  gap: '8px',
  borderRadius: '54px',
  background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
  color: '#FFFFFF',
  textTransform: 'none',
}));

const PrimaryButton2Text = styled(Typography)(() => ({
  height: '30px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '20px',
  lineHeight: '30px',
  color: '#FFFFFF',
}));

interface ImageContainerProps {
    align: 'flex-start' | 'center' | 'flex-end';
  }
  
  const ImageContainer = styled(Box)<ImageContainerProps>(({ align }) => ({
    display: 'flex',
    justifyContent: align,
    alignItems: 'center',
    width: 'auto',
    height: '100%',
  }));

  export default function EGHeader({ screenSize, isXLScreen, onScreenChange }: EGHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <EGHeaderContainer screenSize={screenSize} menuOpen={menuOpen} style={{height: menuOpen ? '400px' : 'auto'}}>
<ImageContainer align="flex-start" style={{ width: isXLScreen ? '210px' : 'auto', alignItems: 'flex-start' }}>
        <img src={rightonlogo} alt="Right On Logo"/>
      </ImageContainer>
      <ImageContainer align="center" style={{ flexDirection: 'column' }}>
        {isXLScreen ? (
          <Box display="flex" gap="80px">
          <TransparentButton onClick={() => onScreenChange(Screen.ExploreGamesScreen)}>
            <img src={dice} alt="Games Icon" />
            Games
          </TransparentButton>
          <TransparentButton onClick={() => onScreenChange(Screen.ExploreQuestionsScreen)}>
            <img src={qmarks} alt="Questions Icon" />
            Questions
          </TransparentButton>
          <TransparentButton onClick={() => onScreenChange(Screen.MyLibraryScreen)}>
            <img src={books} alt="My Library Icon" />
            My Library
          </TransparentButton>
        </Box>
        ) : (
          <>
            <IconButton onClick={handleMenuToggle}>
                <img src={menuOpen ? hamburgerX : hamburger} alt="Hamburger Menu" />
            </IconButton>
            <Collapse in={menuOpen} timeout={500} unmountOnExit>
              <Box
                display="flex"
                flexDirection="column"
                gap="16px"
                alignItems="flex-start"
                padding="16px"
              >
                {/* Menu items */}
                <TransparentButton onClick={() => onScreenChange(Screen.ExploreGamesScreen)}>
            <img src={dice} alt="Games Icon" />
            Games
          </TransparentButton>
          <TransparentButton onClick={() => onScreenChange(Screen.ExploreQuestionsScreen)}>
            <img src={qmarks} alt="Questions Icon" />
            Questions
          </TransparentButton>
          <TransparentButton onClick={() => onScreenChange(Screen.MyLibraryScreen)}>
            <img src={books} alt="My Library Icon" />
            My Library
          </TransparentButton>
                <PrimaryButton2 style={{width:'125px'}}> 
                <img src={dice} alt="Plus Icon" />
                <PrimaryButton2Text>Game</PrimaryButton2Text> 
            </PrimaryButton2>
            <PrimaryButton2 style={{width:'155px'}}> 
                <img src={qmarks} alt="Plus Icon" />
                <PrimaryButton2Text>Question</PrimaryButton2Text> 
            </PrimaryButton2>
              </Box>
            </Collapse>
          </>
        )}
      </ImageContainer>
      <ImageContainer align="flex-end" style={{ width: isXLScreen ? 'auto' : '120px', alignItems: 'flex-start' }}>
      {isXLScreen ? (
            <>
            <PrimaryButton2 style={{marginTop: '12px'}}> 
                <img src={plus} alt="Plus Icon" />
                <PrimaryButton2Text>Create</PrimaryButton2Text> 
            </PrimaryButton2>
            <img src={profile} alt="Profile" style={{ marginLeft: '24px' }} />
            </>
        ) : (
            <img src={profile} alt="Profile" />
        )}
    </ImageContainer>    
    </EGHeaderContainer>
  );
}
