import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Generator from './containers/Generator';
import Eval from './containers/Eval';
import Search from './containers/Search';
import Theme from './lib/Theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generator />}/>
        <Route path="/eval" element={<Eval />}/>
        <Route path="/search" element={<Search />}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
