import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import Timer from './Timer';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/2_Molecules/Timer',
  component: Timer,
} as Meta<typeof Timer>;

const Template: StoryFn<typeof Timer> = function TimerTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <Timer {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

const handleTimerIsFinished = () => {};

export const Default = Template.bind({});
Default.args = {
  totalTime: 30,
  handleTimerIsFinished,
};
