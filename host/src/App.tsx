import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useAPIClients, Environment } from '@righton/networking';
import GameSessionContainer from './containers/GameSessionContainer';
import CreateNewGameSession from './containers/CreateNewGameSession';

const theme = createTheme({
  palette: {
    primary: {
      main: '#307583',
    },
    secondary: {
      main: '#8e2e9d',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

const RedirectToCentralIfMissing = () => {
  window.location.href = 'http://dev-central.rightoneducation.com/';
  return null;
};

function App() {

  const { apiClients, loading } = useAPIClients(Environment.Developing);
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/host/:gameSessionId">
            {apiClients &&
              <GameSessionContainer apiClients={apiClients} />
            }
          </Route>
          <Route path="/new/:gameId">
            {apiClients && 
              <CreateNewGameSession apiClients={apiClients} />
            }
          </Route>
          <Route>
            <RedirectToCentralIfMissing />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
