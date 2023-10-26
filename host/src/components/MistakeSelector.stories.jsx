import React from "react";
import MistakeSelector from "./MistakeSelector";

export default {
  title: "MistakeSelector",
  component: MistakeSelector,
  parameters: {
    layout: 'centered',
  }
};
const Template = args => <MistakeSelector {...args} />;

export const Top3Mode = Template.bind({});
Top3Mode.args = {
  mistakeText: '4x^4 - x^3 + 7x^2 - 6x',
  mistakePercent: '44%',
  isTop3Mode: true
};

export const ManualMode = Template.bind({});
ManualMode.args = {
  mistakeText: '4x^4 - x^3 + 7x^2 - 6x',
  mistakePercent: '44%',
  isTop3Mode: false
};