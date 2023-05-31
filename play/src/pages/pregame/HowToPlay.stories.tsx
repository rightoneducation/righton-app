import React, { useState } from 'react';
import { GameSessionState } from '@righton/networking';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import HowToPlay from './HowToPlay';
import Theme from '../../lib/Theme';

export default {
  title: 'Design System/4_Pages/HowToPlay',
  component: HowToPlay,
} as ComponentMeta<typeof HowToPlay>;

const Template: ComponentStory<typeof HowToPlay> = function AnswerCardTemplate(
  args
) {
  return (
    <I18nextProvider i18n={i18n} defaultNS='translation'>
      <BrowserRouter>
        <ThemeProvider theme={Theme}>
          <HowToPlay {...args} />
        </ThemeProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

let retryCount = 0;
const handleRetry = () => {
  retryCount += 1;
}

export const IsLoading = Template.bind({});

IsLoading.args = {
  isError: false,
  isLoading: true,
};

export const IsWaitingForTeacher = Template.bind({});
IsWaitingForTeacher.args = {
  isError: false,
  isLoading: false,
};

export const IsError = Template.bind({});
IsError.args = {
  isError: true,
  isLoading: false,
};