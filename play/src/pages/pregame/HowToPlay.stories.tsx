import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import HowToPlay from './HowToPlay';
import Theme from '../../lib/Theme';
import { LobbyMode } from '../../lib/PlayModels';
import i18n from '../../i18n';

export default {
  title: 'Design System/4_Pages/HowToPlay',
  component: HowToPlay,
} as Meta<typeof HowToPlay>;

const Template: StoryFn<typeof HowToPlay> = function AnswerCardTemplate(args) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n} defaultNS="translation">
          <HowToPlay {...args} />
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export const IsLoading = Template.bind({});

IsLoading.args = {
  mode: LobbyMode.LOADING,
};

export const IsWaitingForTeacher = Template.bind({});
IsWaitingForTeacher.args = {
  mode: LobbyMode.READY,
};

export const IsError = Template.bind({});
IsError.args = {
  mode: LobbyMode.ERROR,
};
