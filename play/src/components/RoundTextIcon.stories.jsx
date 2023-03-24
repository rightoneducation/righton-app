import React from "react";
import RoundTextIcon from "./RoundTextIcon.jsx";

export default {
  title: "RoundTextIcon",
  component: RoundTextIcon
};

const Template = args => <RoundTextIcon {...args} />;

export const DefaultAnswer = Template.bind({});
DefaultAnswer.args = {
  answerStatus: "default",
  submitted: false,
  answerText: 'Sample',
  index: '0'
};

export const DefaultAnswerSubmitted = Template.bind({});
DefaultAnswerSubmitted.args = {
  answerStatus: "default",
  submitted: true,
  answerText: 'Sample',
  index: '0'
};

export const CorrectAnswer = Template.bind({});
CorrectAnswer.args = {
  answerStatus: "correct",
  submitted: false,
  answerText: 'Sample',
  index: '0'
};

export const CorrectAnswerSubmitted = Template.bind({});
CorrectAnswerSubmitted.args = {
  answerStatus: "correct",
  submitted: true,
  answerText: 'Sample',
  index: '0'
};

export const SelectedAnswer = Template.bind({});
SelectedAnswer.args = {
  answerStatus: "selected",
  submitted: false,
  answerText: 'Sample',
  index: '0'
};

export const SelectedAnswerSubmitted = Template.bind({});
SelectedAnswerSubmitted.args = {
  answerStatus: "selected",
  submitted: true,
  answerText: 'Sample',
  index: '0'
};

