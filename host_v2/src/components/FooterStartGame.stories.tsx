import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';
import FooterStartGame from './FooterStartGame';

export default {
  title: 'Design System/3_Organisms/Footer',
  component: FooterStartGame,
} as Meta<typeof FooterStartGame>;

const Template: StoryFn<typeof FooterStartGame> =
  function FooterStartGameTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <FooterStartGame {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };
export const NoTeams = Template.bind({});
NoTeams.args = {
  teamsLength: 0,
};

export const Teams = Template.bind({});
Teams.args = {
  teamsLength: 2,
};
