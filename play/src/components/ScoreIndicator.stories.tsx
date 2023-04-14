import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import ScoreIndicator from './ScoreIndicator';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/1_Atoms/ScoreIndicator',
  component: ScoreIndicator,
} as ComponentMeta<typeof ScoreIndicator>;

const Template: ComponentStory<typeof ScoreIndicator> =
  function ScoreIndicatorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <ScoreIndicator {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  score: 120,
  newPoints: 10,
};
