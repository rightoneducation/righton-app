import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import LeaderboardSelector from './LeaderboardSelector';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/2_Molecules/LeaderboardSelector',
  component: LeaderboardSelector,
} as ComponentMeta<typeof LeaderboardSelector>;

const Template: ComponentStory<typeof LeaderboardSelector> =
  function LeaderboardSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <LeaderboardSelector {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  teamName: 'Andrew Wyeth',
  teamAvatar: 0,
  teamScore: 120,
};
