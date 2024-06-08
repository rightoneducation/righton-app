import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import {APIClients, Environment} from '@righton/networking';
import HostContainer from './containers/HostContainer';
import Theme from './lib/Theme';

function App() {
  const apiClients = new APIClients(Environment.Developing);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <HostContainer apiClients={apiClients} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
