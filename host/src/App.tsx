import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
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
  window.location.href = 'http://test-central.rightoneducation.com/';
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/host/:gameSessionId">
            <GameSessionContainer />
          </Route>
          <Route path="/new/:gameId">
            <CreateNewGameSession />
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
