import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import AnswerSelector from './AnswerSelector';
import AnswerState from '../lib/PlayModels';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/2_Molecules/AnswerSelector',
  component: AnswerSelector,
} as ComponentMeta<typeof AnswerSelector>;

const Template: ComponentStory<typeof AnswerSelector> =
  function AnswerSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <AnswerSelector {...args} />
      </ThemeProvider>
    );
  };

export const DefaultAnswer = Template.bind({});
DefaultAnswer.args = {
  answerStatus: AnswerState.DEFAULT,
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};

export const DefaultAnswerSubmitted = Template.bind({});
DefaultAnswerSubmitted.args = {
  answerStatus: AnswerState.DEFAULT,
  isSubmitted: true,
  answerText: 'Sample',
  index: 0,
};

export const CorrectAnswer = Template.bind({});
CorrectAnswer.args = {
  answerStatus: AnswerState.CORRECT,
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};

export const CorrectAnswerSubmitted = Template.bind({});
CorrectAnswerSubmitted.args = {
  answerStatus: AnswerState.CORRECT,
  isSubmitted: true,
  answerText: 'Sample',
  index: 0,
};

export const SelectedAnswer = Template.bind({});
SelectedAnswer.args = {
  answerStatus: AnswerState.SELECTED,
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};

export const SelectedAnswerSubmitted = Template.bind({});
SelectedAnswerSubmitted.args = {
  answerStatus: AnswerState.SELECTED,
  isSubmitted: true,
  answerText: 'Sample',
  index: 0,
};
