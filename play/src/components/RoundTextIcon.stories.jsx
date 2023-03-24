import React from "react";
import RoundTextIcon from "./RoundTextIcon.jsx";

export default {
  title: "RoundTextIcon",
  component: RoundTextIcon
};

const Template = args => <RoundTextIcon {...args} />;

export const CorrectAnswer = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CorrectAnswer.args = {
  answerStatus: "correct",
};

export const SelectedAnswer = Template.bind({});
SelectedAnswer.args = {
  answerStatus: "selected",
};

export const UnselectedAnswer = Template.bind({});
UnselectedAnswer.args = {
  answerStatus: "unselected",
};