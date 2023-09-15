import React from 'react';
import { GameSessionParser } from '@righton/networking';
import HeaderGame from './HeaderGame';
import MockGameSession from '../mock/MockGameSession.json';

export default {
  title: 'HeaderGame',
  component: HeaderGame,
  argTypes: { handleSkipToResults: { action: 'handleSkipToResults' } },
};
const gameSession =
  GameSessionParser.gameSessionFromAWSGameSession(MockGameSession);
const Template = (args) => <HeaderGame {...args} />;

export const PhaseOne = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseOne.args = {
  ...gameSession,
  statePosition: 2,
  phaseOneTime: 60,
  currentQuestion: 1,
  totalQuestions: 3,
  headerGameCurrentTime: 100,
  totalRoundTime: 300,
  gameTimer: true,
};

export const PhaseOneResults = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseOneResults.args = {
  ...gameSession,
  statePosition: 3,
  currentQuestion: 1,
  totalQuestions: 3,
  headerGameCurrentTime: 100,
  totalRoundTime: 300,
};

export const PhaseTwo = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseTwo.args = {
  ...gameSession,
  statePosition: 6,
  phaseTwoTime: 300,
  currentQuestion: 1,
  totalQuestions: 3,
  headerGameCurrentTime: 100,
  totalRoundTime: 300,
  gameTimer: true,
};

export const PhaseTwoResults = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseTwoResults.args = {
  ...gameSession,
  statePosition: 7,
  currentQuestion: 1,
  totalQuestions: 3,
  headerGameCurrentTime: 100,
  totalRoundTime: 300,
};

export const SecondQuestion = Template.bind({});
SecondQuestion.args = {
  ...gameSession,
  statePosition: 3,
  currentQuestion: 2,
  totalQuestions: 3,
  headerGameCurrentTime: 100,
  totalRoundTime: 300,
  gameTimer: true,
};
