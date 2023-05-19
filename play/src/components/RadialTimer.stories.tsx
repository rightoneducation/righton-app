import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import RadialTimer from './RadialTimer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/1_Atoms/RadialTimer',
  component: RadialTimer,
} as ComponentMeta<typeof RadialTimer>;

const Template: ComponentStory<typeof RadialTimer> =
  function RadialTimerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <RadialTimer {...args} />
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
