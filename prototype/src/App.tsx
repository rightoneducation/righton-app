import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Generator from './containers/Generator';
import Eval from './containers/Eval';
import Search from './containers/Search';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generator />}/>
        <Route path="/eval" element={<Eval />}/>
        <Route path="/search" element={<Search />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
