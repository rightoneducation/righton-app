import React, { useState } from 'react';
import { APIClients, Environment, AppType } from '@righton/networking';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { ScreenSize } from './lib/HostModels';
import Theme from './lib/Theme';
import ExploreGames from './pages/ExploreGames';
import ExploreQuestions from './pages/ExploreQuestions'; 
import MyLibrary from './pages/MyLibrary';
import EGHeader from './components/EGHeader';
import { Screen} from './lib/ScreenEnums';



function App() {
  const apiClients = new APIClients(Environment.Developing, AppType.CENTRAL);
  const theme = useTheme();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const screenSize = isLargeScreen  // eslint-disable-line
  ? ScreenSize.LARGE 
  : isMediumScreen 
    ? ScreenSize.MEDIUM 
    : ScreenSize.SMALL;
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ExploreGamesScreen); // Manage current screen state

  const handleScreenChange = (newScreen: Screen) => {
    setCurrentScreen(newScreen); // Update the screen when header buttons are clicked
  };

  return (
    <ThemeProvider theme={Theme}>
      <EGHeader screenSize={screenSize} isXLScreen={isXLScreen} onScreenChange={handleScreenChange} />
      {currentScreen === Screen.ExploreGamesScreen && <ExploreGames apiClients={apiClients} />}
      {currentScreen === Screen.ExploreQuestionsScreen && <ExploreQuestions apiClients={apiClients} />}
      {currentScreen === Screen.MyLibraryScreen && <MyLibrary apiClients={apiClients} />}
    </ThemeProvider>
  );
}

export default App;
