import React from 'react';
import RoundTextIcon from './RoundTextIcon.js';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Design System/2_Molecules/RoundTextIcon',
  component: RoundTextIcon
} as ComponentMeta<typeof RoundTextIcon>;

const Template: ComponentStory<typeof RoundTextIcon> = (args) => <RoundTextIcon {...args} />;

export const DefaultAnswer = Template.bind({});
DefaultAnswer.args = {
  answerStatus: 'default',
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};

export const DefaultAnswerSubmitted = Template.bind({});
DefaultAnswerSubmitted.args = {
  answerStatus: 'default',
  isSubmitted: true,
  answerText: 'Sample',
  index: 0,
};

export const CorrectAnswer = Template.bind({});
CorrectAnswer.args = {
  answerStatus: 'correct',
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};

export const CorrectAnswerSubmitted = Template.bind({});
CorrectAnswerSubmitted.args = {
  answerStatus: 'correct',
  isSubmitted: true,
  answerText: 'Sample',
  index: 0,
};

export const SelectedAnswer = Template.bind({});
SelectedAnswer.args = {
  answerStatus: 'selected',
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};

export const SelectedAnswerSubmitted = Template.bind({});
SelectedAnswerSubmitted.args = {
  answerStatus: 'selected',
  isSubmitted: true,
  answerText: 'Sample',
  index: 0,
};