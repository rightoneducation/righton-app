import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { APIClients, Environment, AppType } from '@righton/networking';
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
  window.location.href = 'http://central.rightoneducation.com/';
  return null;
};

const apiClients = new APIClients(Environment.Developing, AppType.HOST );

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/host/:gameSessionId">
            <GameSessionContainer apiClients={apiClients} />
          </Route>
          <Route path="/new/:gameId">
            <CreateNewGameSession apiClients={apiClients} />
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
