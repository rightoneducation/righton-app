import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { AppContainer } from '../lib/styledcomponents/StyledComponents';
import { Header } from '../components/Header';
import { Home } from '../pages/Home';
import { AboutUs } from '../pages/AboutUs';
import { HowItWorks } from '../pages/HowItWorks';
import { Library } from '../pages/Library';
import { ScreenType, ScreenSize } from '../lib/WebsiteModels';
import { Footer } from '../components/Footer';

export default function AppSwitch({ currentScreen }: { currentScreen: ScreenType }) {
  const theme = useTheme();
     const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen // eslint-disable-line
      ? ScreenSize.LARGE
      : isMediumScreen
        ? ScreenSize.MEDIUM
        : ScreenSize.SMALL;

  let pageComponent;
  switch (currentScreen) {
    case ScreenType.LIBRARY:
      pageComponent = (<Library/>);
      break;
    case ScreenType.HOW_IT_WORKS:
      pageComponent = (<HowItWorks/>);
      break;
    case ScreenType.ABOUT_US:
      pageComponent = (<AboutUs screenSize={screenSize}/>);
      break;
    case ScreenType.HOME:
    default:
      pageComponent = (<Home screenSize={screenSize}/>)
      break;
  }

  return (
    <AppContainer>
      <Header/>
      {pageComponent}
      <Footer/>
    </AppContainer>
  )
}