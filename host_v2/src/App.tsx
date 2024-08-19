import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import {APIClients, Environment, AppType} from '@righton/networking';
import HostContainer from './containers/HostContainer';
import Theme from './lib/Theme';

function RedirectToPlayIfMissing() {
  window.location.href = 'http://central.rightoneducation.com/';
  return null;
}
const apiClients = new APIClients(Environment.Developing);
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"        
        element={<GameSessionContainer apiClients={apiClients}/>}
      />
      <Route element={<RedirectToPlayIfMissing />} />
    </>,
  ),
);

function App() {
  const apiClients = new APIClients(Environment.Developing, AppType.HOST);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <HostContainer apiClients={apiClients} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
