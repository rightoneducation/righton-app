import React from 'react';
import { Box } from '@mui/material';
import { AppContainer } from '../lib/styledcomponents/StyledComponents';
import { Header } from '../components/Header';
import { Home } from '../pages/Home';
import { AboutUs } from '../pages/AboutUs';
import { HowItWorks } from '../pages/HowItWorks';
import { Library } from '../pages/Library';
import { ScreenType } from '../lib/WebsiteModels';
import { Footer } from '../components/Footer';

export default function AppSwitch({ currentScreen }: { currentScreen: ScreenType }) {
  let pageComponent;
  switch (currentScreen) {
    case ScreenType.LIBRARY:
      pageComponent = (<Library/>);
      break;
    case ScreenType.HOW_IT_WORKS:
      pageComponent = (<HowItWorks/>);
      break;
    case ScreenType.ABOUT_US:
      pageComponent = (<AboutUs/>);
      break;
    case ScreenType.HOME:
    default:
      pageComponent = (<Home/>)
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