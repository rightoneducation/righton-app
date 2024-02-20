import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import AnswerBar from './AnswerBar';
import Theme from '../../lib/Theme';
import i18n from '../../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/AnswerBar',
  component: AnswerBar,
} as Meta<typeof AnswerBar>;

const Template: StoryFn<typeof AnswerBar> = function AnswerBarTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <AnswerBar {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};
export const answerbar = Template.bind({});

answerbar.args = {
  inputNum: 5,
  totalNum: 12,
};

export const answerBarNoAnswers = Template.bind({});

answerBarNoAnswers.args = {
  inputNum: 0,
  totalNum: 12,
};

export const answerBarAllAnswers = Template.bind({});

answerBarAllAnswers.args = {
  inputNum: 12,
  totalNum: 12,
};
