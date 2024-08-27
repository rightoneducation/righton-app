import React from 'react';
import {APIClients, Environment, AppType} from '@righton/networking';
import { ThemeProvider } from '@mui/material/styles'; 
import ExploreGames from './pages/ExploreGames';
import Theme from './lib/Theme';
import './App.css';

function App() {
  const apiClients = new APIClients(Environment.Developing, AppType.HOST);
  return (
    <ThemeProvider theme={Theme}>
      <ExploreGames apiClients={apiClients} />
    </ThemeProvider>
  );
}

export default App;
