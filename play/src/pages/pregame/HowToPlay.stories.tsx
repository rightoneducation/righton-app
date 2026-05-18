import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { RightOnTheme as Theme } from '@righton/networking';
import HowToPlay from './HowToPlay';
import i18n from '../../i18n';

export default {
  title: 'Design System/4_Pages/HowToPlay',
  component: HowToPlay,
} as Meta<typeof HowToPlay>;

const Template: StoryFn<typeof HowToPlay> = function AnswerCardTemplate() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n} defaultNS="translation">
          <HowToPlay />
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export const Default = Template.bind({});
