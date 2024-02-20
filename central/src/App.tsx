import React, { useState } from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { 
  ApiClient,
  GameSessionAPIClient,
  Environment,
 } from '@righton/networking';
import { RouteContainer } from './containers/RouteContainer';
import AlertContext, { Alert } from './context/AlertContext';

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

function App() {
  const apiClient = new ApiClient(Environment.Staging);
  const [alert, setAlert] = useState<Alert | null>(null);
  const alertContext = {
    alert,
    setAlert,
  };

  return (
    <ThemeProvider theme={theme}>
      <AlertContext.Provider value={alertContext}>
        <Router>
          <RouteContainer apiClient={apiClient} setAlert={setAlert}/>
        </Router>
      </AlertContext.Provider>
    </ThemeProvider>
  );
}

export default App;
