import React from "react";
import ButtonSubmitAnswer from "./ButtonSubmitAnswer.jsx";

export default {
  title: 'Design System/1_Atoms/SmallButton',
  component: ButtonSubmitAnswer
};

const Template = args => <ButtonSubmitAnswer {...args} />;

export const DefaultState = Template.bind({});
DefaultState.args = {
  isSubmitted: false,
  isSelected: false,
};

export const AnswerSelected = Template.bind({});
AnswerSelected.args = {
  isSelected: true,
  isSubmitted: false,
};

export const AnswerSubmitted = Template.bind({});
AnswerSubmitted.args = {
  isSelected: true,
  isSubmitted: true,
};