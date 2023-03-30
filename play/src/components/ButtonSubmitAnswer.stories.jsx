import React from "react";
import ButtonSubmitAnswer from "./ButtonSubmitAnswer.jsx";

export default {
  title: 'Design System/1_Atoms/SmallButton',
  component: ButtonSubmitAnswer
};

const Template = args => <ButtonSubmitAnswer {...args} />;

const handleSubmitAnswer = () => { //todo
  setIsSubmitted(true);
}

export const DefaultState = Template.bind({});
DefaultState.args = {
  isSubmitted: false,
  isSelected: false,
};

export const AnswerSelected = Template.bind({});
AnswerSelected.args = {
  isSelected: true,
  isSubmitted: false,
  handleSubmitAnswer: handleSubmitAnswer,
};

export const AnswerSubmitted = Template.bind({});
AnswerSubmitted.args = {
  isSelected: true,
  isSubmitted: true,
};