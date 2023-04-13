import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import Timer from './Timer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/2_Molecules/Timer',
  component: Timer,
} as ComponentMeta<typeof Timer>;

const Template: ComponentStory<typeof Timer> = function TimerTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <Timer {...args} />
    </ThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  totalTime: 30,
};
