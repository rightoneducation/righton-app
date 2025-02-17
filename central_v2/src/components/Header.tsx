import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Typography, Collapse, IconButton, Paper } from '@mui/material';
import rightonlogo from '../images/rightonlogo.svg';
import dice from '../images/dice.svg';
import dicePink from '../images/dicePink.svg';
import qmark from '../images/qmark.svg';
import qmarkPink from '../images/qmarkPink.svg';
import books from '../images/books.svg';
import lib from '../images/lib.svg';
import libPink from '../images/libPink.svg';
import profile from '../images/profileplaceholder.svg';
import hamburger from '../images/hamburger.svg';
import hamburgerX from '../images/hamburgerX.svg';
import plus from '../images/plus.svg';
import createDropdownGame from '../images/createDropdownGame.svg';
import createDropdownQuestion from '../images/createDropdownQuestion.svg'
import { ScreenType, ScreenSize } from '../lib/CentralModels';
import CentralButton from './button/Button';
import { ButtonType } from './button/ButtonModels';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';

interface HeaderProps {
  currentScreen: ScreenType;
  screenSize: ScreenSize;
  isLgScreen: boolean;
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
  isUserLoggedIn: boolean;
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
    position: 'relative',
    backgroundColor: `${theme.palette.primary.lightBlueBackgroundColor}`,
    backgroundImage: `
      linear-gradient(180deg, rgb(2, 33, 95) 0%, rgba(2, 33, 95, 0) 100%),
      url(${mathSymbolsBackground})
    `,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom', // Adjust as needed
    zIndex: 1,
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
  borderStyle: 'none',
  borderColor: `${theme.palette.primary.buttonNavBorder}`,
  '&:hover': {
    background: 'none',
    borderRadius: `${theme.sizing.xSmPadding}px`,
    borderWidth: '0.75px',
    borderColor: `${theme.palette.primary.buttonNavBorder}`,
    borderStyle: 'solid',
  },
  '&:disabled': {
    opacity: 0.3,
  },
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
  position: 'relative'
}));

const CreateDropDown = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  padding: `${theme.sizing.xSmPadding}px`,
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
}));

const PinkIcon = styled('img')(({ theme }) => ({
  filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(2857%) hue-rotate(317deg) brightness(91%) contrast(103%)',
}));

interface ButtonTextProps {
  active: boolean;
}

const ButtonText = styled(Typography)<ButtonTextProps>(({ active, theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '30px',
  textAlign: 'center',
  textTransform: 'none',
  color: active ? `${theme.palette.primary.buttonNavSelected}` : '#FFFFFF',
}));

interface ImageContainerProps {
  align: 'flex-start' | 'center' | 'flex-end';
}

const ImageContainer = styled(Box)<ImageContainerProps>(({ align }) => ({
  display: 'flex',
  justifyContent: align,
  alignItems: 'center',
  height: '100%',
  width: 'auto'
}));

export default function Header({
  currentScreen,
  screenSize,
  isLgScreen,
  menuOpen,
  setMenuOpen,
  isUserLoggedIn
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

  console.log(menuOpen);
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

  const createMenu = [
    <CreateButtonContainer>
    <Box style={{zIndex: 4}}>
      <CentralButton buttonType={ButtonType.CREATE} isEnabled smallScreenOverride={screenSize === ScreenSize.SMALL} onClick={() => (setIsCreateMenuOpen(!isCreateMenuOpen))}/>                
    </Box>
    <Collapse in={isCreateMenuOpen} style={{position: 'absolute', top: '50%', zIndex: 3, width: '100%'}}>
      <CreateDropDown>
        <Box style={{display: 'flex', gap: `${theme.sizing.smPadding}px`, paddingTop: `${theme.sizing.mdPadding}px`}}>
          <img src={createDropdownGame} alt="Create Game" />
          <Typography style={{color: `${theme.palette.primary.darkBlue}`, fontWeight: 400, fontSize: 16}}>
            Game
          </Typography>
        </Box>
        <Box style={{display: 'flex', gap: `${theme.sizing.smPadding}px`, cursor: 'pointer'}} onClick={() => { setMenuOpen(false); setIsCreateMenuOpen(false); navigate('/create/question')}}>
          <img src={createDropdownQuestion} alt="Create Question" />
          <Typography style={{color: `${theme.palette.primary.darkBlue}`, fontWeight: 400, fontSize: 16}}>
            Question
          </Typography>
        </Box>
      </CreateDropDown>
    </Collapse>              
  </CreateButtonContainer>
  ]

  const loggedInUserComponents = [
    isLgScreen ? (
      <Box display="flex" justifyContent="center" alignItems="center" style={{height: '100%'}}>
        {createMenu}
        <img src={profile} alt="Profile" style={{ marginLeft: '24px' }} />
      </Box>
    ) : (
      <img src={profile} alt="Profile" />
    )
  ]

  return (
    <Collapse
      in
      timeout={500}
      style={{
        transition: 'height 0.5s ease-in-out',
        height: getHeight(),
        width: '100%',
        overflow: !isLgScreen ? 'hidden' : 'visible',
        zIndex: 0,
        position: 'fixed',
        background: 'linear-gradient(180deg, rgb(2, 33, 95) 0%, rgba(2, 33, 95, 0) 100%)',
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
            cursor: 'pointer'
          }}
          onClick={() =>
            handleButtonClick(ScreenType.GAMES)
          }
        >
          <img src={rightonlogo} alt="Right On Logo" />
        </ImageContainer>
        <ImageContainer align="center" style={{ flexDirection: 'column' }}>
          {isLgScreen ? (
            <Box display="flex" gap="80px">
              <TransparentButton
                disableRipple
                onClick={() =>
                  handleButtonClick(ScreenType.GAMES)
                }
                active={
                  selectedScreen === ScreenType.GAMES
                }
              >
                { selectedScreen === ScreenType.GAMES
                  ? <PinkIcon src={dice} alt="Games Icon" />
                  : <img src={dice} alt="Games Icon" />
                }
                <ButtonText active={selectedScreen === ScreenType.GAMES}>
                  Games
                </ButtonText>
              </TransparentButton>
              <TransparentButton
                disableRipple
                onClick={() =>
                  handleButtonClick(ScreenType.QUESTIONS)
                }
                active={
                  selectedScreen === ScreenType.QUESTIONS
                }
              >
                { selectedScreen === ScreenType.QUESTIONS
                  ? <PinkIcon src={qmark} alt="Questions Icon" />
                  : <img src={qmark} alt="Questions Icon" />
                }
                <ButtonText active={selectedScreen === ScreenType.QUESTIONS}>
                  Questions
                </ButtonText>
              </TransparentButton>
              <TransparentButton
                disableRipple
                onClick={() =>
                  handleButtonClick(ScreenType.LIBRARY)
                }
                active={selectedScreen === ScreenType.LIBRARY}
              >
                 { selectedScreen === ScreenType.LIBRARY
                  ? <PinkIcon src={books} alt="Library Icon" />
                  : <img src={books} alt="Library Icon" />
                }
                <ButtonText active={selectedScreen === ScreenType.LIBRARY}>
                  My Library
                </ButtonText>
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
        <Box style={{width: 'fit-content', display: 'flex', gap: '16px', justifyContent: 'center'}}>
          {isUserLoggedIn 
            ? loggedInUserComponents
            :
              <>
                <CentralButton buttonType={ButtonType.LOGIN} isEnabled onClick={() => navigate('/login')}/>
                <CentralButton buttonType={ButtonType.SIGNUP} isEnabled onClick={() => navigate('/signup')} />   
              </>
          }
        </Box>
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
            { selectedScreen === ScreenType.GAMES
              ? <img src={dicePink} alt="Games Icon" />
              : <img src={dice} alt="Games Icon" />
            }
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
            { selectedScreen === ScreenType.QUESTIONS
              ? <img src={qmarkPink} alt="Questions Icon" />
              : <img src={qmark} alt="Questions Icon" />
            }
            Questions
          </TransparentButton>
          <TransparentButton
            onClick={() =>
              handleButtonClick(ScreenType.LIBRARY)
            }
            active={selectedScreen === ScreenType.LIBRARY}
            menuOpen={menuOpen}
          >
            { selectedScreen === ScreenType.LIBRARY
              ? <img src={libPink} alt="Library Icon" />
              : <img src={lib} alt="Library Icon" />
            }
            My Library
          </TransparentButton>
          {isUserLoggedIn && createMenu}
        </Box>
      )}
    </Collapse>
  );
}
