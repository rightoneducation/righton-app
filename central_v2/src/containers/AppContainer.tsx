import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ScreenType, ScreenSize } from '../lib/CentralModels';
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

interface BodyContainerProps {
  screenSize: ScreenSize;
}

const BodyContainer = styled(Box)<BodyContainerProps>(
  ({ theme, screenSize }) => ({
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none',
    position: 'relative'
  }),
);

interface AppContainerProps {
  currentScreen: ScreenType;
  isTabsOpen?: boolean;
  setIsTabsOpen?: (isTabsOpen: boolean) => void;
  children: React.ReactNode;
  isUserLoggedIn: boolean;
}

function AppContainer({ currentScreen, isTabsOpen, setIsTabsOpen, isUserLoggedIn, children }: AppContainerProps) {
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
          setMenuOpen={setMenuOpen}
          isUserLoggedIn={isUserLoggedIn}
        />
      </HeaderContainer>
      <BodyContainer screenSize={screenSize}>{children}</BodyContainer>
    </ScreenContainer>
  );
}

export default AppContainer;
