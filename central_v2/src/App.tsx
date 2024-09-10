import React from 'react';
import { APIClients, Environment, AppType } from '@righton/networking';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Theme from './lib/Theme';
import MainContainer from './containers/MainContainer';

function App() {
  const apiClients = new APIClients(Environment.Developing, AppType.CENTRAL);
 
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <MainContainer apiClients={apiClients}/>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
