import React from "react";
import ScoreIndicator from "./ScoreIndicator.jsx";

export default {
  title: 'Design System/1_Atoms/ScoreIndicator',
  component: ScoreIndicator
};

const Template = args => <ScoreIndicator {...args} />;

export const HighScore = Template.bind({});
HighScore.args = {
  score: 120,
};

export const MedScore = Template.bind({});
MedScore.args = {
  score: 12,
};

export const LowScore = Template.bind({});
LowScore.args = {
  score: 1,
};

export const NoScore = Template.bind({});
NoScore.args = {
  score: null,
};
