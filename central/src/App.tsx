import React, { useState } from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { APIClients, Environment, AppType } from '@righton/networking';
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
  const [alert, setAlert] = useState<Alert | null>(null);
  const apiClients = new APIClients(Environment.Developing, AppType.CENTRAL);
  const alertContext = {
    alert,
    setAlert,
  };

  return (
    <ThemeProvider theme={theme}>
      <AlertContext.Provider value={alertContext}>
        <Router>
          <RouteContainer setAlert={setAlert} apiClients={apiClients}/>
        </Router>
      </AlertContext.Provider>
    </ThemeProvider>
  );
}

export default App;
