import React from 'react';
import { ThemeProvider } from '@mui/material/styles'; 
import ExploreGames from './pages/ExploreGames';
import Theme from './lib/Theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <ExploreGames sampleProp="placeholder" />
    </ThemeProvider>
  );
}

export default App;
