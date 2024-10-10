import React, { useState } from 'react';
import { APIClients } from '@righton/networking';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ScreenSize } from '../lib/CentralModels';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions'; 
import MyLibrary from '../pages/MyLibrary';
import EGHeader from '../components/EGHeader';
import { SelectedCentralPages } from '../lib/ScreenEnums';

const ScreenContainer = styled(Box)(({ theme }) => ({
  width: '100%', 
  height: '100vh', 
  backgroundColor: `${theme.palette.primary.extraDarkBlue}`
}));

interface BodyContainerProps {
  screenSize: ScreenSize;
}

const BodyContainer = styled(Box)<BodyContainerProps>(({ screenSize }) => ({
  paddingTop: screenSize === ScreenSize.SMALL ? '77px' : '94px', 
  boxSizing: 'border-box', 
  height: '100%'
}));

interface MainContainerProps {
  apiClients: APIClients;
}

function MainContainer({
  apiClients
}: MainContainerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const screenSize = isLargeScreen  // eslint-disable-line
  ? ScreenSize.LARGE 
  : isMediumScreen 
    ? ScreenSize.MEDIUM 
    : ScreenSize.SMALL;
  const [currentScreen, setCurrentScreen] = useState<SelectedCentralPages>(SelectedCentralPages.ExploreGamesScreen); // Manage current screen state

  const handleScreenChange = (newScreen: SelectedCentralPages) => {
    setCurrentScreen(newScreen); // Update the screen when header buttons are clicked
  };
  return (
    <ScreenContainer>
      <EGHeader screenSize={screenSize} isXLScreen={isXLScreen} onScreenChange={handleScreenChange} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <BodyContainer screenSize={screenSize}>
        {currentScreen === SelectedCentralPages.ExploreGamesScreen && <ExploreGames apiClients={apiClients} />}
        {currentScreen === SelectedCentralPages.ExploreQuestionsScreen && <ExploreQuestions apiClients={apiClients} />}
        {currentScreen === SelectedCentralPages.MyLibraryScreen && <MyLibrary apiClients={apiClients} />}
      </BodyContainer>
    </ScreenContainer>
  );
}

export default MainContainer;
