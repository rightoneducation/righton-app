import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Typography, Collapse, Fade, IconButton, Paper } from '@mui/material';
import { CloudFrontDistributionUrl } from '@righton/networking';
import rightonlogo from '../images/rightOnLogoHeader.svg';
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
import { useCentralDataState } from '../hooks/context/useCentralDataContext';
import createDropdownGame from '../images/createDropdownGame.svg';
import createDropdownQuestion from '../images/createDropdownQuestion.svg'
import { ScreenType, ScreenSize, GameQuestionType, UserStatusType } from '../lib/CentralModels';
import CentralButton from './button/Button';
import { ButtonType } from './button/ButtonModels';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';
import PublicPrivateButton from './button/publicprivatebutton/PublicPrivateButton';
import GameQuestionButton from './button/gamequestionbutton/GameQuestionButton';

interface HeaderProps {
  currentScreen: ScreenType;
  screenSize: ScreenSize;
  isLgScreen: boolean;
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
  gameQuestion?: GameQuestionType;
  setGameQuestion?: (gameQuestion: GameQuestionType) => void;
  handleLogOut: () => void;
  userStatus: UserStatusType;
}

interface HeaderContainerProps {
  screenSize: ScreenSize;
  menuOpen: boolean;
  currentScreen: ScreenType;
}
const HeaderContainer = styled(Box, {
 shouldForwardProp: (prop) => prop !== 'screenSize' && prop !== 'menuOpen' && prop !== 'currentScreen', 
})<HeaderContainerProps>(
  ({ screenSize, menuOpen, currentScreen, theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    gap: `${theme.sizing.mdPadding}px`,
    transition: 'height 0.5s ease-in-out',
  }),
);

const HeaderFirstRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  zIndex: 7,
}));

const HeaderSecondRow = styled(HeaderFirstRow)(({ theme }) => ({
  justifyContent: 'center'
}));

const TransparentButton = styled(Button,
  {
    shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'menuOpen',
  }
)<{
  isActive?: boolean;
  menuOpen?: boolean;
}>(({ isActive, menuOpen, theme }) => ({
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
  isActive: boolean;
}

const ButtonText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ButtonTextProps>(({ isActive, theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '30px',
  textAlign: 'center',
  textTransform: 'none',
  color: isActive ? `${theme.palette.primary.buttonNavSelected}` : '#FFFFFF',
}));

interface ImageContainerProps {
  align: 'flex-start' | 'center' | 'flex-end';
}

const ImageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<ImageContainerProps>(({ align }) => ({
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
  gameQuestion,
  setGameQuestion,
  handleLogOut,
  userStatus,
}: HeaderProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const centralData = useCentralDataState();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const profilePicPath = centralData.userProfile?.profilePicPath;
  console.log('profilePicPath', profilePicPath);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleButtonClick = (screen: ScreenType) => {
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

  const createMenu = [
    <CreateButtonContainer key="createMenu" style={{paddingRight: '24px'}}>
    <Box style={{zIndex: 9}}>
      <CentralButton buttonType={ButtonType.CREATE} isEnabled smallScreenOverride={screenSize === ScreenSize.SMALL} onClick={() => (setIsCreateMenuOpen(!isCreateMenuOpen))}/>                
    </Box>
    <Collapse in={isCreateMenuOpen} style={{position: 'absolute', top: '50%', zIndex: 8, width: '100%'}}>
      <CreateDropDown>
        <Box style={{display: 'flex', gap: `${theme.sizing.smPadding}px`, paddingTop: `${theme.sizing.mdPadding}px`, cursor: 'pointer'}} onClick={() => { setMenuOpen(false); setIsCreateMenuOpen(false); navigate('/create/game')}}>
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
      <Box display="flex" justifyContent="center" alignItems="center" style={{height: '100%',}} key="lgscreen">
        {createMenu}
        <CentralButton buttonType={ButtonType.LOGOUT} isEnabled onClick={handleLogOut}/>
        <img src={`${CloudFrontDistributionUrl}${profilePicPath}`} alt="Profile" style={{ marginLeft: '24px', height: '62px', width: '62px', objectFit: 'cover', border: '4px #FFF solid', borderRadius: '31px', boxSizing: 'border-box' }} />
      </Box>
    ) : (
      <img src={`${CloudFrontDistributionUrl}${profilePicPath}`} alt="Profile"  style={{height: '62px', width: '62px', objectFit: 'cover', border: '4px #FFF solid', borderRadius: '31px', boxSizing: 'border-box' }} />
    )
  ]

  return (
      <HeaderContainer screenSize={screenSize} menuOpen={menuOpen} currentScreen={currentScreen}>
      <Collapse
        in={menuOpen === true}
        timeout='auto'
        collapsedSize={0}
        style={{
          width: '100%', 
          zIndex: 7,
          position: 'absolute',
          background: `linear-gradient(180deg, rgb(2, 33, 95, 85) 60%, rgba(2, 33, 95, 0) 100%)`,
        }}
      > 
        <Box
          style={{ 
            marginTop: '94px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', 
            gap: '12px'   
          }} 
        >
          <TransparentButton
            onClick={() =>
              handleButtonClick(ScreenType.GAMES)
            }
            isActive={currentScreen === ScreenType.GAMES}
            menuOpen={menuOpen}
          >
            { currentScreen === ScreenType.GAMES
              ? <img src={dicePink} alt="Games Icon" />
              : <img src={dice} alt="Games Icon" />
            }
            Games
          </TransparentButton>
          <TransparentButton
            onClick={() =>
              handleButtonClick(ScreenType.QUESTIONS)
            }
            isActive={
              currentScreen === ScreenType.QUESTIONS
            }
            menuOpen={menuOpen}
          >
            { currentScreen === ScreenType.QUESTIONS
              ? <img src={qmarkPink} alt="Questions Icon" />
              : <img src={qmark} alt="Questions Icon" />
            }
            Questions
          </TransparentButton>
          {userStatus === UserStatusType.LOGGEDIN && 
            <TransparentButton
              onClick={() =>
                handleButtonClick(ScreenType.LIBRARY)
              }
              isActive={currentScreen === ScreenType.LIBRARY}
              menuOpen={menuOpen}
            >
              { currentScreen === ScreenType.LIBRARY
                ? <img src={libPink} alt="Library Icon" />
                : <img src={lib} alt="Library Icon" />
              }
              My Library
            </TransparentButton>
          }
          {userStatus === UserStatusType.LOGGEDIN && createMenu}
        </Box>
      </Collapse>
        <HeaderFirstRow>
        <ImageContainer
          align="flex-start"
          style={{
            width: isLgScreen ? '210px' : 'auto',
            alignItems: 'flex-start',
            cursor: 'pointer',
            
          }}
          onClick={() =>
            handleButtonClick(ScreenType.GAMES)
          }
        >
          <img src={rightonlogo} alt="Right On Logo" style={{maxHeight: '55px'}}/>
        </ImageContainer>
        <ImageContainer align="center" style={{ flexDirection: 'column' }}>
          {isLgScreen ? (
            <Box display="flex" gap="80px">
              <TransparentButton
                disableRipple
                onClick={() =>
                  handleButtonClick(ScreenType.GAMES)
                }
                isActive={
                  currentScreen === ScreenType.GAMES
                }
              >
                { currentScreen === ScreenType.GAMES
                  ? <PinkIcon src={dice} alt="Games Icon" />
                  : <img src={dice} alt="Games Icon" />
                }
                <ButtonText isActive={currentScreen === ScreenType.GAMES}>
                  Games
                </ButtonText>
              </TransparentButton>
              <TransparentButton
                disableRipple
                onClick={() =>
                  handleButtonClick(ScreenType.QUESTIONS)
                }
                isActive={
                  currentScreen === ScreenType.QUESTIONS
                }
              >
                { currentScreen === ScreenType.QUESTIONS
                  ? <PinkIcon src={qmark} alt="Questions Icon" />
                  : <img src={qmark} alt="Questions Icon" />
                }
                <ButtonText isActive={currentScreen === ScreenType.QUESTIONS}>
                  Questions
                </ButtonText>
              </TransparentButton>
              
              { ((userStatus === UserStatusType.LOGGEDIN) || (currentScreen === ScreenType.LIBRARY)) && 
                <TransparentButton
                  disableRipple
                  onClick={() =>
                    handleButtonClick(ScreenType.LIBRARY)
                  }
                  isActive={currentScreen === ScreenType.LIBRARY}
                >
                  { currentScreen === ScreenType.LIBRARY
                    ? <PinkIcon src={books} alt="Library Icon" />
                    : <img src={books} alt="Library Icon" />
                  }
                  <ButtonText isActive={currentScreen === ScreenType.LIBRARY}>
                    My Library
                  </ButtonText>
                </TransparentButton>
              }
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
          { userStatus !== UserStatusType.LOADING && (
              userStatus === UserStatusType.LOGGEDIN 
                ? loggedInUserComponents
                :
                  <>
                    <CentralButton buttonType={ButtonType.LOGINHEADER} isEnabled onClick={() => navigate('/login')}/>
                    <CentralButton buttonType={ButtonType.SIGNUP} isEnabled onClick={() => navigate('/signup')} />   
                  </>
              )
          }
        </Box>
        </HeaderFirstRow>
        <Collapse
          in
          style={{
            transition: currentScreen === ScreenType.LIBRARY ? 'height 0.5s ease-in-out' : 'none',
            height: currentScreen === ScreenType.LIBRARY ? '94px' : '0px',
          }}
        > 
          <HeaderSecondRow>
            <Fade in={currentScreen === ScreenType.LIBRARY} timeout={{enter: 1000, exit: 0}}  style={{transition: 'height 0.5s ease-in-out'}}>
              <div>
              <GameQuestionButton isDisabled={false} gameQuestion={gameQuestion} setGameQuestion={setGameQuestion}/>
              </div>
            </Fade>
          </HeaderSecondRow>
          </Collapse>
      </HeaderContainer>
  );
}