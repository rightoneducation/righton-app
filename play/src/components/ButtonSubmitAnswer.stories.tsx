import React from "react";
import ButtonSubmitAnswer from "./ButtonSubmitAnswer.js";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Design System/1_Atoms/SmallButton',
  component: ButtonSubmitAnswer
} as ComponentMeta<typeof ButtonSubmitAnswer>;

const Template: ComponentStory<typeof ButtonSubmitAnswer> = (args) => <ButtonSubmitAnswer {...args} />;

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