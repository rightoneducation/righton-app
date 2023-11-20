import React from 'react';
import { Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiClient,
  Environment
} from '@righton/networking';
import IntroButtonStyled from './lib/styledcomponents/IntroButtonStyled';
import BackgroundContainerStyled from './lib/styledcomponents/layout/BackgroundContainerStyled';
import './App.css';

const apiClient = new ApiClient(Environment.Testing);

function App() {
  const handleCreateGame = async () => {
    try {
      const gameTemplate = await apiClient.createGameTemplate(
        uuidv4(),
        "First Game",
        "Owner: Michel Foucault",
        0,
        "Description of the game",
        "E",
        "E",
        "5",
        "A",
        120,
        120,
        "https://www.google.com",
      );
      console.log(gameTemplate);
      return gameTemplate;
    } catch (e) {
      console.log(e);
    }
  }

  const handleCreateQuestion = async () => {
    try {
      const questionTemplate = await apiClient.createQuestionTemplate(
        uuidv4(),
        "First Question",
        "Owner: Michel Foucault",
        0,
        "Choices: A, B, C, D",
        "Choose the correct answer",
        "E",
        "E",
        "5",
        "A",
        "https://www.google.com",
      );
      console.log(questionTemplate);
      return questionTemplate;
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <BackgroundContainerStyled />
      <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', gap: 16}}>
      <IntroButtonStyled
          onClick={() => {
            handleCreateGame();
          }}
          style={{
            background: `linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)`,
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
          }}
        >
          <div style={{ color: 'white' }}>
            Create Game Template
          </div>
          </IntroButtonStyled>
          <IntroButtonStyled
          onClick={() => {
            handleCreateQuestion();
          }}
          style={{
            background: `linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)`,
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
          }}
        >
          <div style={{ color: 'white' }}>
            Create Question Template
          </div>
          </IntroButtonStyled>
        </Box>
    </>
  );
}

export default App;
