import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import HeaderContent from "./HeaderContent";
import { GameSessionState } from '@righton/networking'

export default {
  title: 'Design System/3_Organisms/HeaderContent',
  component: HeaderContent
} as ComponentMeta<typeof HeaderContent>;

const Template: ComponentStory<typeof HeaderContent> = (args) => <HeaderContent {...args} />;

const handleTimerIsFinished = () => {
  console.log('finished');
};

export const ChooseCorrectAnswer = Template.bind({});
ChooseCorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const ChooseTrickAnswer = Template.bind({});
ChooseTrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Phase1Discuss = Template.bind({});
Phase1Discuss.args = {
  currentState: GameSessionState.PHASE_1_DISCUSS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Phase2Discuss = Template.bind({});
Phase2Discuss.args = {
  currentState: GameSessionState.PHASE_2_DISCUSS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Phase1Results = Template.bind({});
Phase1Results.args = {
  currentState: GameSessionState.PHASE_1_RESULTS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Phase2Results = Template.bind({});
Phase2Results.args = {
  currentState: GameSessionState.PHASE_2_RESULTS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Correct = Template.bind({});
Correct.args = {
  isCorrect: true,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Incorrect = Template.bind({});
Incorrect.args = {
  isIncorrect: true,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};


