import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import GameInProgress from './pages/GameInProgress';


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
    button: {
      textTransform: 'none'
    },
  },
});

const RedirectToCentralIfMissing = () => {
  window.location.href = 'http://central.rightoneducation.com/';
  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" >
            <GameInProgress />
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
