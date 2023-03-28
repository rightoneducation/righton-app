import React from "react";
import CardAnswer from "./CardAnswer.jsx";

export default {
  title: "CardAnswer",
  component: CardAnswer
};

const Template = args => <CardAnswer {...args} />;

export const CorrectAnswer = Template.bind({});
CorrectAnswer.args = {
  isCorrectAnswer: true,
  answers: [{text: "Answer 1"}, {text: "Answer 2"}, {text: "Answer 3"}, {text: "Answer 4"}],
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  isCorrectAnswer: false,
  answers: [{text: "Answer 1"}, {text: "Answer 2"}, {text: "Answer 3"}, {text: "Answer 4"}],
};