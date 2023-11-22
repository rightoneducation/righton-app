import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import RadialTimer from './RadialTimer';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/1_Atoms/RadialTimer',
  component: RadialTimer,
} as Meta<typeof RadialTimer>;

const Template: StoryFn<typeof RadialTimer> = function RadialTimerTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <RadialTimer {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

const countdownColor = 'rgba(225, 65, 107';

export const Default = Template.bind({});
Default.args = {
  radius: 110,
  timerStartInSeconds: 5,
  inputColors: [
    `${countdownColor}, 0.3)`,
    `${countdownColor}, 0.4)`,
    `${countdownColor}, 0.5)`,
    `${countdownColor}, 0.6)`,
    `${countdownColor}, 0.7)`,
    `${countdownColor}, 0.8)`,
    `${countdownColor}, 0.9)`,
    `${countdownColor}, 1)`,
  ],
};
