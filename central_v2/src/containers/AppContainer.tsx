import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ScreenType, ScreenSize, GameQuestionType } from '../lib/CentralModels';
import Header from '../components/Header';
import { HeaderContainer } from '../lib/styledcomponents/HeaderContainerStyledComponent';
import { ModalBackground } from '../lib/styledcomponents/QuestionTabsStyledComponents';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';

const ScreenContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  
}));

const BodyContainer = styled(Box)(() => {
    return {
      width: '100%',
      display: 'flex',
      flexGrow: 1,
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        // Chrome and Safari
        display: 'none',
      },
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none',
    }
  }
);

interface AppContainerProps {
  currentScreen: ScreenType;
  isTabsOpen?: boolean;
  setIsTabsOpen?: (isTabsOpen: boolean) => void;
  gameQuestion?: GameQuestionType;
  setGameQuestion?: (gameQuestion: GameQuestionType) => void
  children: React.ReactNode;
  isUserLoggedIn: boolean;
}

function AppContainer({ 
  currentScreen, 
  isTabsOpen, 
  setIsTabsOpen, 
  gameQuestion,
  setGameQuestion,
  isUserLoggedIn, 
  children 
}: AppContainerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [menuOpen, setMenuOpen] = useState(false);
  const screenSize = isLgScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const handleBackToExplore = () => {
    if (setIsTabsOpen)
      setIsTabsOpen(false);
  }
  return (
    <ScreenContainer>
      <HeaderContainer>
        { isTabsOpen && 
          <QuestionTabsModalBackground 
            isTabsOpen={isTabsOpen} 
            handleBackToExplore={handleBackToExplore} 
          />
        }
        <Header
          currentScreen={currentScreen}
          screenSize={screenSize}
          isLgScreen={isLgScreen}
          menuOpen={menuOpen}
          gameQuestion={gameQuestion}
          setGameQuestion={setGameQuestion}
          setMenuOpen={setMenuOpen}
          isUserLoggedIn={isUserLoggedIn}
        />
      </HeaderContainer>
      <BodyContainer>{children}</BodyContainer>
    </ScreenContainer>
  );
}

export default AppContainer;
