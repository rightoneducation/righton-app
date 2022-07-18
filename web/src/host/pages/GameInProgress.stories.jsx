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
  ...MockGameSession,
  currentState: "INITIAL_INTRO",
  currentQuestionId: 1,
};

export const SecondQuestion = Template.bind({});
SecondQuestion.args = {
  ...MockGameSession,
  currentState: "CHOOSING_TRICK_ANSWER",
  currentQuestionId: 2,
};
