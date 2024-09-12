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
import { SelectedCentralPages } from '../lib/ScreenEnums';

interface EGHeaderProps {
  screenSize: ScreenSize;
  isXLScreen: boolean;
  onScreenChange: (newScreen: SelectedCentralPages) => void;
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}

interface EGHeaderContainerProps {
  screenSize: ScreenSize;
  menuOpen: boolean;
}
const EGHeaderContainer = styled(Box)<EGHeaderContainerProps>(({ screenSize, menuOpen, theme }) => ({
  height: screenSize === ScreenSize.SMALL ? '77px' : '94px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: `${theme.sizing.smPadding}px ${theme.sizing.lgPadding}px ${theme.sizing.smPadding}px ${theme.sizing.lgPadding}px`,
  boxSizing: 'border-box',
  position: 'sticky',
  top: 0,
}));

const TransparentButton = styled(Button)<{ active?: boolean; menuOpen?: boolean }>(({ active, menuOpen, theme }) => ({
  display: 'flex',
  justifyContent: menuOpen ? 'flex-start' : 'center',
  width: '200px',
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
    marginRight:`${theme.sizing.xSmPadding}px`,
  },
}));


const PrimaryButton2 = styled(Button)(({theme}) => ({
  width: '123px',
  minWidth: '44px',
  height: '38px',
  gap: `${theme.sizing.xSmPadding}px`,
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
const CreateBox = styled(Box)(({theme}) =>({
    width: '199px',
    height: '154px',
    padding: `${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px`,
    gap: `${theme.sizing.smPadding}px`,
    borderRadius: `${theme.sizing.smPadding}px`,
    background: '#36598D',
    boxSizing: 'border-box'
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

export default function EGHeader({ screenSize, isXLScreen, onScreenChange, menuOpen, setMenuOpen }: EGHeaderProps) {
  const [selectedScreen, setSelectedScreen] = useState<SelectedCentralPages>(SelectedCentralPages.ExploreGamesScreen);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleButtonClick = (screen: SelectedCentralPages) => {
    setSelectedScreen(screen);
    onScreenChange(screen);
  };
  const getHeight = () => {
    if (menuOpen)
      return '418px';
    if (screenSize === ScreenSize.SMALL)
      return '77px';
    return '94px';
  }
  return (
       <Collapse
        in
        timeout={500}
        style={{
          transition: 'height 0.5s ease-in-out',
          height: getHeight(),
          width: '100%',
          overflow: 'hidden',
          zIndex: 5,
          position: 'fixed',
          background: 'linear-gradient(360deg, #02215F 0%, #0D68B1 100%)',
          padding: '0px 0px 16px 0px',
          display: 'flex',
          justifyContent: 'center', // Center the entire menu box horizontally
        }}
      >
     
      <EGHeaderContainer screenSize={screenSize} menuOpen={menuOpen}>
        <ImageContainer align="flex-start" style={{ width: isXLScreen ? '210px' : 'auto', alignItems: 'flex-start' }}>
          <img src={rightonlogo} alt="Right On Logo" />
        </ImageContainer>
        <ImageContainer align="center" style={{ flexDirection: 'column' }}>
          {isXLScreen ? (
            <Box display="flex" gap="80px">
              <TransparentButton
                onClick={() => handleButtonClick(SelectedCentralPages.ExploreGamesScreen)}
                active={selectedScreen === SelectedCentralPages.ExploreGamesScreen}
              >
                <img src={dice} alt="Games Icon" />
                Games
              </TransparentButton>
              <TransparentButton
                onClick={() => handleButtonClick(SelectedCentralPages.ExploreQuestionsScreen)}
                active={selectedScreen === SelectedCentralPages.ExploreQuestionsScreen}
              >
                <img src={qmarks} alt="Questions Icon" />
                Questions
              </TransparentButton>
              <TransparentButton
                onClick={() => handleButtonClick(SelectedCentralPages.MyLibraryScreen)}
                active={selectedScreen === SelectedCentralPages.MyLibraryScreen}
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
      {menuOpen && 
           <Box
           display="flex"
           flexDirection="column"
           gap="12px"
           alignItems= "flex-start"
           width="200px" // Set a fixed width to the box
           style={{ margin: '0 auto',}} // This centers the box horizontally
         >
           <TransparentButton
             onClick={() => handleButtonClick(SelectedCentralPages.ExploreGamesScreen)}
             active={selectedScreen === SelectedCentralPages.ExploreGamesScreen}
             menuOpen={menuOpen}
           >
             <img src={dice} alt="Games Icon" />
             Games
           </TransparentButton>
           <TransparentButton
             onClick={() => handleButtonClick(SelectedCentralPages.ExploreQuestionsScreen)}
             active={selectedScreen === SelectedCentralPages.ExploreQuestionsScreen}
             menuOpen={menuOpen}
           >
             <img src={qmarks} alt="Questions Icon" />
             Questions
           </TransparentButton>
           <TransparentButton
             onClick={() => handleButtonClick(SelectedCentralPages.MyLibraryScreen)}
             active={selectedScreen === SelectedCentralPages.MyLibraryScreen}
             menuOpen={menuOpen}
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
        }
     </Collapse>
  );
}
