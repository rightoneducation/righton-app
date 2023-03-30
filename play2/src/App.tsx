import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import GameSessionContainer from './containers/GameSessionContainer';


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
        <Routes>
          <Route path="/" >
            <GameSessionContainer />
          </Route>
          <Route>
            <RedirectToCentralIfMissing />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
