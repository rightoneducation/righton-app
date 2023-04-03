import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Timer from "./Timer";

export default {
  title: 'Design System/2_Molecules/Timer',
  component: Timer
}  as ComponentMeta<typeof Timer>;

const handleTimerIsFinished = () => {
  console.log('finished');
};

const Template: ComponentStory<typeof Timer> = (args) => {
  return <Timer {...args} />
};

export const FiveSecondTimer = Template.bind({});
FiveSecondTimer.args = {
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const FifteenSecondTimer = Template.bind({});
FifteenSecondTimer.args = {
  totalTime: 15,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const TwoMinuteFiveSecondTimer = Template.bind({});
TwoMinuteFiveSecondTimer.args = {
  totalTime: 125,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};
