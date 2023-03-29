import React, { useState } from "react";
import Header from "./Header";

export default {
  title: "Header",
  component: Header
};
const handleTimerIsFinished = () => {
  console.log('finished');
};

const Template = args => <Header {...args} />;

export const CorrectAnswer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CorrectAnswer.args = {
  headerState: 'correctAnswer',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};


export const TrickAnswer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TrickAnswer.args = {
  headerState: 'trickAnswer',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const AnswerExplanation = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AnswerExplanation.args = {
  headerState: 'answerExplanations',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Correct = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Correct.args = {
  headerState: 'correct',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Incorrect = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Incorrect.args = {
  headerState: 'incorrect',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Phase1Result = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase1Result.args = {
  headerState: 'phase1Results',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Phase2Result = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase2Result.args = {
  headerState: 'phase2Results',
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};
