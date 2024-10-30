import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Typography, Collapse, IconButton, Paper } from '@mui/material';
import rightonlogo from '../images/rightonlogo.svg';
import dice from '../images/Dice.svg';
import qmarks from '../images/qmarks.svg';
import books from '../images/books.svg';
import profile from '../images/profileplaceholder.svg';
import hamburger from '../images/hamburger.svg';
import hamburgerX from '../images/hamburgerX.svg';
import plus from '../images/plus.svg';
import createDropdownGame from '../images/createDropdownGame.svg';
import createDropdownQuestion from '../images/createDropdownQuestion.svg'
import { ScreenType, ScreenSize } from '../lib/CentralModels';
import { SelectedCentralPages } from '../lib/ScreenEnums';
import CentralButton from './button/Button';
import { ButtonType } from './button/ButtonModels';

interface HeaderProps {
  currentScreen: ScreenType;
  screenSize: ScreenSize;
  isLgScreen: boolean;
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}

interface HeaderContainerProps {
  screenSize: ScreenSize;
  menuOpen: boolean;
}
const HeaderContainer = styled(Box)<HeaderContainerProps>(
  ({ screenSize, menuOpen, theme }) => ({
    height: '94px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.sizing.smPadding}px ${theme.sizing.lgPadding}px ${theme.sizing.smPadding}px ${theme.sizing.lgPadding}px`,
    boxSizing: 'border-box',
  }),
);

const TransparentButton = styled(Button)<{
  active?: boolean;
  menuOpen?: boolean;
}>(({ active, menuOpen, theme }) => ({
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
    marginRight: `${theme.sizing.xSmPadding}px`,
  },
}));

const PrimaryButton2 = styled(Button)(({ theme }) => ({
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
const CreateBox = styled(Box)(({ theme }) => ({
  width: '199px',
  height: '154px',
  padding: `${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px`,
  gap: `${theme.sizing.smPadding}px`,
  borderRadius: `${theme.sizing.smPadding}px`,
  background: '#36598D',
  boxSizing: 'border-box',
}));

const CreateButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const CreateDropDown = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  padding: `${theme.sizing.xSmPadding}px`,
  borderBottomLeftRadius: '24px',
  borderBottomRightRadius: '24px',
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

export default function Header({
  currentScreen,
  screenSize,
  isLgScreen,
  menuOpen,
  setMenuOpen,
}: HeaderProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<ScreenType>(
    currentScreen
  );

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleButtonClick = (screen: ScreenType) => {
    setSelectedScreen(screen);
    switch (screen) {
      case ScreenType.QUESTIONS:
        navigate('/questions');
        break;
      case ScreenType.LIBRARY:
        navigate('/library');
        break;
      case ScreenType.GAMES:
      default:
        navigate('/');
        break;
    }
  };
  const getHeight = () => {
    if (menuOpen) return '418px';
    return '94px';
  };
  return (
    <Collapse
      in
      timeout={500}
      style={{
        transition: 'height 0.5s ease-in-out',
        height: getHeight(),
        width: '100%',
        overflow: !isLgScreen ? 'hidden' : 'visible',
        zIndex: 5,
        position: 'fixed',
        background: 'linear-gradient(360deg, #02215F 0%, #0D68B1 100%)',
        padding: '0px 0px 16px 0px',
        display: 'flex',
        justifyContent: 'center', // Center the entire menu box horizontally
        boxSizing: 'border-box',
      }}
    >
      <HeaderContainer screenSize={screenSize} menuOpen={menuOpen}>
        <ImageContainer
          align="flex-start"
          style={{
            width: isLgScreen ? '210px' : 'auto',
            alignItems: 'flex-start',
          }}
        >
          <img src={rightonlogo} alt="Right On Logo" />
        </ImageContainer>
        <ImageContainer align="center" style={{ flexDirection: 'column' }}>
          {isLgScreen ? (
            <Box display="flex" gap="80px">
              <TransparentButton
                onClick={() =>
                  handleButtonClick(ScreenType.GAMES)
                }
                active={
                  selectedScreen === ScreenType.GAMES
                }
              >
                <img src={dice} alt="Games Icon" />
                Games
              </TransparentButton>
              <TransparentButton
                onClick={() =>
                  handleButtonClick(ScreenType.QUESTIONS)
                }
                active={
                  selectedScreen === ScreenType.QUESTIONS
                }
              >
                <img src={qmarks} alt="Questions Icon" />
                Questions
              </TransparentButton>
              <TransparentButton
                onClick={() =>
                  handleButtonClick(ScreenType.LIBRARY)
                }
                active={selectedScreen === ScreenType.LIBRARY}
              >
                <img src={books} alt="My Library Icon" />
                My Library
              </TransparentButton>
            </Box>
          ) : (
            <IconButton onClick={handleMenuToggle}>
              <img
                src={menuOpen ? hamburgerX : hamburger}
                alt="Hamburger Menu"
              />
            </IconButton>
          )}
        </ImageContainer>
        <ImageContainer
          align="flex-end"
          style={{
            width: isLgScreen ? 'auto' : '120px',
            alignItems: 'flex-start',
          }}
        >
          {isLgScreen ? (
            <Box display="flex" justifyContent="center" alignItems="center" style={{height: '100%'}}>
            <Box display="flex" justifyContent="flex-start" alignItems="flex-start" style={{height: '50%'}} >
              <CreateButtonContainer>
                <Box style={{zIndex: 4}}>
                  <CentralButton buttonType={ButtonType.CREATE} isEnabled onClick={() => (setIsCreateMenuOpen(!isCreateMenuOpen))}/>                
                </Box>
                <Collapse in={isCreateMenuOpen} style={{position: 'relative', top: '-17px', zIndex: 3}}>
                  <CreateDropDown>
                    <Box style={{display: 'flex', gap: `${theme.sizing.smPadding}px`, paddingTop: `${theme.sizing.mdPadding}px`}}>
                      <img src={createDropdownGame} alt="Create Game" />
                      <Typography style={{color: `${theme.palette.primary.darkBlue}`, fontWeight: 400, fontSize: 16}}>
                        Game
                      </Typography>
                    </Box>
                    <Box style={{display: 'flex', gap: `${theme.sizing.smPadding}px`, cursor: 'pointer'}} onClick={() => navigate('/create/question')}>
                      <img src={createDropdownQuestion} alt="Create Question" />
                      <Typography style={{color: `${theme.palette.primary.darkBlue}`, fontWeight: 400, fontSize: 16}}>
                        Question
                      </Typography>
                    </Box>
                  </CreateDropDown>
                </Collapse>              
              </CreateButtonContainer>
            </Box>
            <img src={profile} alt="Profile" style={{ marginLeft: '24px' }} />
            </Box>
          ) : (
            <img src={profile} alt="Profile" />
          )}
        </ImageContainer>
      </HeaderContainer>
      {menuOpen && (
        <Box
          display="flex"
          flexDirection="column"
          gap="12px"
          alignItems="flex-start"
          width="200px" // Set a fixed width to the box
          style={{ margin: '0 auto' }} // This centers the box horizontally
        >
          <TransparentButton
            onClick={() =>
              handleButtonClick(ScreenType.GAMES)
            }
            active={selectedScreen === ScreenType.GAMES}
            menuOpen={menuOpen}
          >
            <img src={dice} alt="Games Icon" />
            Games
          </TransparentButton>
          <TransparentButton
            onClick={() =>
              handleButtonClick(ScreenType.QUESTIONS)
            }
            active={
              selectedScreen === ScreenType.QUESTIONS
            }
            menuOpen={menuOpen}
          >
            <img src={qmarks} alt="Questions Icon" />
            Questions
          </TransparentButton>
          <TransparentButton
            onClick={() =>
              handleButtonClick(ScreenType.LIBRARY)
            }
            active={selectedScreen === ScreenType.LIBRARY}
            menuOpen={menuOpen}
          >
            <img src={books} alt="My Library Icon" />
            My Library
          </TransparentButton>
          <CreateBox>
            <Box
              style={{
                opacity: 0.8,
                gap: '8px',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <img src={plus} alt="Plus Icon" />
              <PrimaryButton2Text>Create</PrimaryButton2Text>
            </Box>
            <Box
              style={{
                padding: '16px 0px 0px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
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
      )}
    </Collapse>
  );
}
