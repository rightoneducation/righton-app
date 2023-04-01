import React, { useState } from "react";
import Timer from "./Timer";

export default {
  title: 'Design System/2_Molecules/Timer',
  component: Timer
};
const handleTimerIsFinished = () => {
  console.log('finished');
};

const Template = args => {
  const [currentTime, setCurrentTime] = useState(args.totalTime);
  return <Timer {...args} currentTime={currentTime} setTime={setCurrentTime} />
};

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished: handleTimerIsFinished,
};

export const Paused = Template.bind({});
Paused.args = {
  totalTime: 5,
  isPaused: true,
  handleTimerIsFinished: handleTimerIsFinished,
};
