import React from 'react';
import { useAPIClients, Environment, AppType } from '@righton/networking';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Theme from './lib/Theme';
import MainContainer from './containers/MainContainer';

function App() {
  const { apiClients, loading } = useAPIClients(Environment.Developing, AppType.CENTRAL);
 
  return (
    <GoogleOAuthProvider clientId="23009502295-0ut6vmh3km13funjo26p409mgmbkeb76.apps.googleusercontent.com">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Theme}>
          { apiClients &&
            <MainContainer apiClients={apiClients}/>
          }
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
