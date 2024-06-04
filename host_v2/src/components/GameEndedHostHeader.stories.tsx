import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import GameEndedHostHeader from './GameEndedHostHeader';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/GameEndedHostHeader',
  component: GameEndedHostHeader,
} as Meta<typeof GameEndedHostHeader>;

const Template: StoryFn<typeof GameEndedHostHeader> = function GameEndedHostHeaderTemplate(args) {
  
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <GameEndedHostHeader {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const GameEndedHostHeaderCode = Template.bind({});

GameEndedHostHeaderCode.args = {
  gameCode: 1234
};

export const GameEndedHostHeaderNOCode = Template.bind({});
GameEndedHostHeaderNOCode.args = {
};

