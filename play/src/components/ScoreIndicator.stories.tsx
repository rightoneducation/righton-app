import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ScoreIndicator from "./ScoreIndicator";

export default {
  title: 'Design System/1_Atoms/ScoreIndicator',
  component: ScoreIndicator
} as ComponentMeta<typeof ScoreIndicator>;

const Template: ComponentStory<typeof ScoreIndicator> = args => <ScoreIndicator {...args} />;

export const AddTenPoints = Template.bind({});
AddTenPoints.args = {
  score: 120,
  newPoints: 10,
};

export const HighScore = Template.bind({});
HighScore.args = {
  score: 120,
  newPoints: 0,
};

export const MedScore = Template.bind({});
MedScore.args = {
  score: 12,
  newPoints: 0,
};

export const LowScore = Template.bind({});
LowScore.args = {
  score: 1,
  newPoints: 0,
};

export const NoScore = Template.bind({});
NoScore.args = {
  score: null,
  newPoints: 0,
};
