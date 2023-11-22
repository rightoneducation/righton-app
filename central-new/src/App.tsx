import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiClient,
  Environment,
  IGameTemplate,
  IQuestionTemplate
} from '@righton/networking';
import Sidebar from './components/Sidebar';
import { SidebarButtons, Pages } from './lib/CentralModels';
import PageContentSwitch from './pages/PageContentSwitch';
import IntroButtonStyled from './lib/styledcomponents/IntroButtonStyled';
import PageContent from './lib/styledcomponents/layout/PageContent';
import './App.css';

const apiClient = new ApiClient(Environment.Testing);

function App() {
  const [page, setPage] = useState<SidebarButtons | null>(null);
  const [gameTemplates, setGameTemplates] = useState<IGameTemplate[] | null>(null);
  const [questionTemplates, setQuestionTemplates] = useState<IQuestionTemplate[] | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const handleButtonClick = (buttonType: SidebarButtons) => {
    if (buttonType === SidebarButtons.CREATE_GLOBAL_GAME)
      handleCreateGame();
    if (buttonType === SidebarButtons.CREATE_GLOBAL_QUESTION)
      handleCreateQuestion();
    if (buttonType === SidebarButtons.GLOBAL_GAMES)
      handleGetGameTemplates(nextToken);
    if (buttonType === SidebarButtons.GLOBAL_QUESTIONS)
      handleGetQuestionTemplates(nextToken);
    setPage(buttonType);
  };
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
      return questionTemplate;
    } catch (e) {
      console.log(e);
    }
  }

  const handleGetGameTemplates = async (nextToken: string | null) => {
    try {
      const gameTemplatesObject = await apiClient.listGameTemplates(nextToken);
      setGameTemplates(gameTemplatesObject?.gameTemplates ?? null);
      setNextToken(gameTemplatesObject?.nextToken ?? null);
      return gameTemplates;
    } catch (e) {
      console.log(e);
    }
  }

  const handleGetQuestionTemplates = async (nextToken: string | null) => {
    try {
      const questionTemplatesObject = await apiClient.listQuestionTemplates(nextToken);
      setQuestionTemplates(questionTemplatesObject?.questionTemplates ?? null);
      setNextToken(questionTemplatesObject?.nextToken ?? null);
      return gameTemplates;
    } catch (e) {
      console.log(e);
    }
  }

  const handleNextPageClick = (nextToken: string | null) => {
    if (page === SidebarButtons.GLOBAL_GAMES)
      handleGetGameTemplates(nextToken);
    if (page === SidebarButtons.GLOBAL_QUESTIONS)
      handleGetQuestionTemplates(nextToken);
  };

  const handleAddQuestionClick = async (gameTemplateId: string, questionTemplateId: string) => {
    try {
      const questionTemplate = await apiClient.createGameQuestions(
        uuidv4(),
        '18f8b797-3d68-4b25-b77d-e3500391122b',
        '09e81481-8d2c-4ccf-8cc9-4eb127ab47bf',
      );
      return questionTemplate;
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start'}}>
      <Sidebar handleButtonClick={handleButtonClick}/>
      <PageContentSwitch pageType={page} gameTemplates={gameTemplates} questionTemplates={questionTemplates} nextToken={nextToken} handleNextPageClick={handleNextPageClick} handleAddQuestionClick={handleAddQuestionClick}/>
    </Box>
  );
}

export default App;
