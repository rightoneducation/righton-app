import React from 'react';
import GameInProgress from './GameInProgress';
import MockGameSession from '../../mocks/gamesession.json';

export default {
  title: 'GameInProgress',
  component: GameInProgress,
}

const Template = (args) => <GameInProgress {...args} />

export const Initial = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Initial.args = {
  MockGameSession,
  currentState: "IN_PROGRESS",
  currentQuestionId: 1,
};

export const SecondQuestion = Template.bind({});
SecondQuestion.args = {
  MockGameSession,
  currentState: "IN_PROGRESS",
  currentQuestionId: 2,
};
