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
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  isCorrectAnswer: false,
};