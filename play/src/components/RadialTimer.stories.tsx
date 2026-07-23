import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import RadialTimer from './RadialTimer';
import { RightOnTheme as Theme } from '@righton/networking';
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

export const Default = Template.bind({});
Default.args = {
  radius: 90,
  timerStartInSeconds: 5,
  inputColors: [
    // one continuous purple→red ramp so brightness rises once around the ring:
    // slow drift through the purples, steeper climb through the reds
    'rgb(97, 67, 129)',
    'rgb(110, 67, 127)',
    'rgb(123, 66, 125)',
    'rgb(135, 66, 122)',
    'rgb(161, 65, 118)',
    'rgb(180, 64, 115)',
    'rgb(199, 63, 111)',
    'rgb(225, 62, 107)',
  ],
};
