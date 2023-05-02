import React from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
} from '@righton/networking';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import GameInProgress from './GameInProgress';
import MockGameSession from '../mock/MockGameSession.json';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/4_Pages/GameInProgress',
  component: GameInProgress,
} as ComponentMeta<typeof GameInProgress>;

const Template: ComponentStory<typeof GameInProgress> =
  function GameInProgressTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <GameInProgress {...args} />
      </ThemeProvider>
    );
  };

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as IAWSGameSession
) as IGameSession;

export const TestStoryOne = Template.bind({});
TestStoryOne.args = {
  teamAvatar: 0,
  teams: gameSession.teams,
  currentState: gameSession.currentState,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
};

export const TestStoryTwo = Template.bind({});
TestStoryTwo.args = {
  teamAvatar: 1,
  teams: gameSession.teams,
  currentState: gameSession.currentState,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-13432234sfasdfsadf',
};
