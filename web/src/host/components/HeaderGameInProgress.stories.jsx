import React from 'react';
import GameInProgressHeader from './HeaderGameInProgress';
import MockGameSession from '../../mocks/gamesession.json';

export default {
  title: 'GameInProgressHeader',
  component: GameInProgressHeader,
  argTypes: { handleSkipToResults: { action: 'handleSkipToResults' } },
}

const Template = (args) => <GameInProgressHeader {...args} />

export const PhaseOne = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseOne.args = {
  ...MockGameSession,
  currentState: "PHASE_ONE",
  phaseOneTime: 60,
  currentQuestionId: 1,
};

export const PhaseOneResults = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseOneResults.args = {
  ...MockGameSession,
  currentState: "PHASE_ONE_RESULTS",
  currentQuestionId: 1,
};

export const PhaseTwo = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseTwo.args = {
  ...MockGameSession,
  currentState: "PHASE_TWO",
  phaseTwoTime: 300,
  currentQuestionId: 1,
};


export const PhaseTwoResults = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PhaseTwoResults.args = {
  ...MockGameSession,
  currentState: "PHASE_TWO_RESULTS",
  currentQuestionId: 1,
};

export const SecondQuestion = Template.bind({});
SecondQuestion.args = {
  ...MockGameSession,
  currentState: "PHASE_ONE",
  currentQuestionId: 2,
};
