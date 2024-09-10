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
  onScreenChange: (newScreen: Screen) => void;
}

interface EGHeaderContainerProps {
  screenSize: ScreenSize;
  menuOpen: boolean;
}
const BackgroundWrapper = styled(Box)<EGHeaderContainerProps>(({ screenSize, menuOpen }) => ({
    background: 'linear-gradient(360deg, #02215F 0%, #0D68B1 100%)',
    zIndex: 100000,
    // height: menuOpen ? '420px' : 'auto',
}));
const EGHeaderContainer = styled(Box)<EGHeaderContainerProps>(({ screenSize, menuOpen }) => ({
  height: screenSize === ScreenSize.SMALL ? '77px' : '94px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  // background: 'linear-gradient(360deg, #02215F 0%, #0D68B1 100%)',
  padding: '16px 32px 16px 32px',
  boxSizing: 'border-box',
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'background 0.5s ease-in-out',
}));

const TransparentButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
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
  opacity: active ? 1 : 0.5, // Apply opacity based on active prop
  '& img': {
    marginRight: '8px',
  },
}));

const PrimaryButton2 = styled(Button)(() => ({
  width: '123px',
  minWidth: '44px',
  height: '38px',
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
const CreateBox = styled(Box)({
    width: '199px',
    height: '154px',
    padding: '8px 8px 8px 16px',
    gap: '16px',
    borderRadius: '16px',
    background: '#36598D',
    boxSizing: 'border-box'
  });

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
  const [selectedScreen, setSelectedScreen] = useState<Screen>(Screen.ExploreGamesScreen);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleButtonClick = (screen: Screen) => {
    setSelectedScreen(screen);
    onScreenChange(screen);
  };

  return (
    <BackgroundWrapper screenSize={screenSize} menuOpen={menuOpen}>
      <EGHeaderContainer screenSize={screenSize} menuOpen={menuOpen}>
        <ImageContainer align="flex-start" style={{ width: isXLScreen ? '210px' : 'auto', alignItems: 'flex-start' }}>
          <img src={rightonlogo} alt="Right On Logo" />
        </ImageContainer>
        <ImageContainer align="center" style={{ flexDirection: 'column' }}>
          {isXLScreen ? (
            <Box display="flex" gap="80px">
              <TransparentButton
                onClick={() => handleButtonClick(Screen.ExploreGamesScreen)}
                active={selectedScreen === Screen.ExploreGamesScreen}
              >
                <img src={dice} alt="Games Icon" />
                Games
              </TransparentButton>
              <TransparentButton
                onClick={() => handleButtonClick(Screen.ExploreQuestionsScreen)}
                active={selectedScreen === Screen.ExploreQuestionsScreen}
              >
                <img src={qmarks} alt="Questions Icon" />
                Questions
              </TransparentButton>
              <TransparentButton
                onClick={() => handleButtonClick(Screen.MyLibraryScreen)}
                active={selectedScreen === Screen.MyLibraryScreen}
              >
                <img src={books} alt="My Library Icon" />
                My Library
              </TransparentButton>
            </Box>
          ) : (
            <IconButton onClick={handleMenuToggle}>
              <img src={menuOpen ? hamburgerX : hamburger} alt="Hamburger Menu" />
            </IconButton>
          )}
        </ImageContainer>
        <ImageContainer align="flex-end" style={{ width: isXLScreen ? 'auto' : '120px', alignItems: 'flex-start' }}>
          {isXLScreen ? (
            <>
              <PrimaryButton2 style={{ marginTop: '12px' }}>
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
      <Collapse
        in={menuOpen}
        timeout={500}
        unmountOnExit
        style={{
          transition: 'height 0.5s ease-in-out',
          height: menuOpen ? 'auto' : 0,
          overflow: 'hidden',
          zIndex: 1100,
          position: 'absolute',
          top: '94px',
          left: 0,
          right: 0,
          backgroundColor: '#02215F',
          padding: '0px 0px 16px 0px',
          display: 'flex',
          justifyContent: 'center', // Center the entire menu box horizontally
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="16px"
          alignItems="flex-start" // Keep the items left-aligned within the box
          width="223px" // Set a fixed width to the box
          style={{ margin: '0 auto' }} // This centers the box horizontally
        >
          <TransparentButton
            onClick={() => handleButtonClick(Screen.ExploreGamesScreen)}
            active={selectedScreen === Screen.ExploreGamesScreen}
          >
            <img src={dice} alt="Games Icon" />
            Games
          </TransparentButton>
          <TransparentButton
            onClick={() => handleButtonClick(Screen.ExploreQuestionsScreen)}
            active={selectedScreen === Screen.ExploreQuestionsScreen}
          >
            <img src={qmarks} alt="Questions Icon" />
            Questions
          </TransparentButton>
          <TransparentButton
            onClick={() => handleButtonClick(Screen.MyLibraryScreen)}
            active={selectedScreen === Screen.MyLibraryScreen}
          >
            <img src={books} alt="My Library Icon" />
            My Library
          </TransparentButton>
          <CreateBox>
            <Box style={{ opacity: .8, gap: '8px', display: 'flex', flexDirection: 'row',}}>
              <img src={plus} alt="Plus Icon" />
              <PrimaryButton2Text>Create</PrimaryButton2Text>
            </Box>
            <Box style={{ padding: '16px 0px 0px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <PrimaryButton2 style={{ width: '120px' }}>
                <img src={dice} alt="Plus Icon" />
                <PrimaryButton2Text>Game</PrimaryButton2Text>
              </PrimaryButton2>
              <PrimaryButton2 style={{ width: '150px' }}>
                <img src={qmarks} alt="Plus Icon" />
                <PrimaryButton2Text>Question</PrimaryButton2Text>
              </PrimaryButton2>
            </Box>
          </CreateBox>
        </Box>
      </Collapse>
      </BackgroundWrapper>
  );
}
