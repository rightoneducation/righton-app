import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Nav from './components/Nav';
import QuestionForm from './components/QuestionForm';
import './App.css';

function App() {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  return (
    <Box>
      <Nav />
      <QuestionForm />
    </Box>
  );
}

export default App;
