
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';
import StartGameButton from './StartGameButton';

export default {
  title: 'Design System/1_Atoms/SmallButton',
  component: StartGameButton,
} as Meta<typeof StartGameButton>;

const Template: StoryFn<typeof StartGameButton> =
  function StartGameButtonTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <StartGameButton {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };
export const Enabled = Template.bind({});
Enabled.args = {
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
