import React from 'react';
import GameInProgress from './GameInProgress';
import HostAnswerDropDown from "../components/AnswersInProgress";
import MockGameSession from '../../mocks/gamesession.json';

export default {
  title: 'GameInProgress',
  component: GameInProgress,
}

const Template = (args) => <GameInProgress {...args} />

const AnswerChoices = (args) => <HostAnswerDropDown {...args} />

export const AnswerChoicesPhase1 = AnswerChoices.bind({});
AnswerChoicesPhase1.args = {
  answer: "A. 360",
  explanation: "1. 360 is the sum of a circle",
  correct: true,
  phase2: false
};

export const Phase1Answers = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase1Answers.args = {
  ...MockGameSession,
  currentState: "CHOOSING_ANSWERS_PHASE1",
  currentQuestionId: 1,
  ...AnswerChoicesPhase1
};

export const Phase2TrickAnswers = Template.bind({});
Phase2TrickAnswers.args = {
  ...MockGameSession,
  currentState: "CHOOSING_TRICK_ANSWERS_PHASE2"
};