import React, { useState } from "react";
import Timer from "./Timer";

export default {
  title: "Timer",
  component: Timer
};

const Template = args => {
  const [currentTime, setCurrentTime] = useState(args.totalRoundTime);
  return <Timer {...args} currentTime={currentTime} setTime={setCurrentTime} />
};

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  totalRoundTime: 150,
  headerGameCurrentTime: 100
};

export const Paused = Template.bind({});
Paused.args = {
  totalRoundTime: 150,
  headerGameCurrentTime: 80
};
