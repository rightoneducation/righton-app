import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import LeaderboardSelector from './LeaderboardSelector';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/2_Molecules/LeaderboardSelector',
  component: LeaderboardSelector,
} as Meta<typeof LeaderboardSelector>;

const Template: StoryFn<typeof LeaderboardSelector> =
  function LeaderboardSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <LeaderboardSelector {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  teamName: 'Andrew Wyeth',
  teamAvatar: 0,
  teamScore: 120,
};
