import React, { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CMSAPIClient } from '@righton/networking';
import { ScreenType } from './lib/WebsiteModels'
import Theme from './lib/Theme';
import Switch from './switches/AppSwitch';

function App() {
  const cmsClient = new CMSAPIClient();
  const router = createBrowserRouter(
    createRoutesFromElements(
          <>
            <Route
              path="/"
              element={<Switch currentScreen={ScreenType.HOME} />}
            />
            <Route
              path="/aboutus"
              element={<Switch currentScreen={ScreenType.ABOUT_US} />}
            />
            <Route
              path="/howitworks"
              element={<Switch currentScreen={ScreenType.HOW_IT_WORKS} />}
            />
            <Route
              path="/library"
              element={<Switch currentScreen={ScreenType.LIBRARY} cmsClient={cmsClient} />}
            />
          </>
        )
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>    
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
