import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Generator from './containers/Generator';
import QuestionGenerator from './containers/QuestionGenerator';

import Eval from './containers/Eval';
import Theme from './lib/Theme';
import './App.css';

// Wrapper component for QuestionGenerator to handle routing
function QuestionGeneratorWrapper() {
  const navigate = useNavigate();

  const handleSubmit = (questionData: any) => {
    console.log('Question data submitted:', questionData);
    // Navigate back to main generator or handle the data
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <QuestionGenerator 
      onSubmit={handleSubmit} 
      onCancel={handleCancel} 
    />
  );
}

function App() {
  return (
    <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Generator />}/> */}
        <Route path="/" element={<QuestionGeneratorWrapper />}/>
        <Route path="/eval" element={<Eval />}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
