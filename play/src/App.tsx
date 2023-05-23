import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { ApiClient, Environment } from '@righton/networking';
import PregameContainer from './containers/PregameContainer';
import Theme from './lib/Theme';

function RedirectToCentralIfMissing() {
  window.location.href = 'http://central.rightoneducation.com/';
  return null;
}

const apiClient = new ApiClient(Environment.Staging);

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<PregameContainer apiClient={apiClient} />}
            />
            <Route element={<RedirectToCentralIfMissing />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
