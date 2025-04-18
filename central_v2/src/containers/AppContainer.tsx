import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { ScreenType, ScreenSize, GameQuestionType, UserStatusType } from '../lib/CentralModels';
import Header from '../components/Header';
import { HeaderContainer } from '../lib/styledcomponents/HeaderContainerStyledComponent';
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
  isValidatingUser: boolean;
  currentScreen: ScreenType;
  gameQuestion?: GameQuestionType;
  setIsTabsOpen?: (isTabsOpen: boolean) => void;
  setLibraryGameQuestionSwitch?: (gameQuestion: GameQuestionType) => void
  handleLogOut: () => void;
  children: React.ReactNode;
  
}

function AppContainer({ 
  isValidatingUser,
  currentScreen, 
  gameQuestion,
  setIsTabsOpen, 
  setLibraryGameQuestionSwitch,
  handleLogOut,
  children 
}: AppContainerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
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
        { centralData.isTabsOpen && 
          <QuestionTabsModalBackground 
            isTabsOpen={centralData.isTabsOpen} 
            handleBackToExplore={handleBackToExplore} 
          />
        }
        <Header
          isValidatingUser={isValidatingUser}
          currentScreen={currentScreen}
          screenSize={screenSize}
          isLgScreen={isLgScreen}
          menuOpen={menuOpen}
          gameQuestion={gameQuestion}
          setGameQuestion={setLibraryGameQuestionSwitch}
          setMenuOpen={setMenuOpen}
          handleLogOut={handleLogOut}
          userStatus={centralData.userStatus}
        />
      </HeaderContainer>
      <BodyContainer>{children}</BodyContainer>
    </ScreenContainer>
  );
}

export default AppContainer;
