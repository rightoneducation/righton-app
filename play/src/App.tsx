import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { useAPIClients, Environment, IAPIClients } from '@righton/networking';
import {
  PregameContainer,
  PregameLocalModelLoader,
} from './containers/PregameContainer';
import {
  GameInProgressContainer,
  LocalModelLoader,
} from './containers/GameInProgressContainer';
import Theme from './lib/Theme';

function RedirectToPlayIfMissing() {
  window.location.href = 'http://dev-play.rightoneducation.com/';
  return null;
}

interface RouteWrapperProps {
  component: React.ComponentType<any>;
  apiClients: any; 
}

function RouteWrapper({ component: Component, apiClients, ...props }: RouteWrapperProps) {
  return <Component apiClients={apiClients} {...props} />;
}

const createCustomRouteProvider = (apiClients: IAPIClients): any => {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RouteWrapper component={PregameContainer} apiClients={apiClients} />} loader={PregameLocalModelLoader} />
        <Route path="/game" element={<RouteWrapper component={GameInProgressContainer} apiClients={apiClients} />} loader={LocalModelLoader} />
        <Route element={<RedirectToPlayIfMissing />} />
      </>
      )
  );
};

function App() {
  const { apiClients, loading } = useAPIClients(Environment.Developing);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        {apiClients &&
          <RouterProvider router={createCustomRouteProvider(apiClients)} />
        }
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
