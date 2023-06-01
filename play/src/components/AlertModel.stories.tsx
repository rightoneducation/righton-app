import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import AlertModal from './AlertModal';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/2_Molecules/AlertModal',
  component: AlertModal,
} as ComponentMeta<typeof AlertModal>;

const Template: ComponentStory<typeof AlertModal> = function AnswerCardTemplate(
  args
) {
  return (
    <I18nextProvider i18n={i18n} defaultNS="translation">
      <BrowserRouter>
        <ThemeProvider theme={Theme}>
          <AlertModal {...args} />
        </ThemeProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

let retryCount = 0;
const handleRetry = () => {
  retryCount += 1;
};

export const InitialError = Template.bind({});

InitialError.args = {
  errorText: {
    title1: 'An error has occurred with the following error message:',
    title2: 'Sample Error Message',
  },
  retry: retryCount,
  handleRetry,
};

export const RetryInProgress = Template.bind({});
RetryInProgress.args = {
  errorText: {
    title1: 'Trying to reconnect...',
    title2: '',
  },
  retry: retryCount,
  handleRetry,
};

export const RetriedTwice = Template.bind({});
RetriedTwice.args = {
  errorText: {
    title1: 'An error has occurred with the following error message:',
    title2: 'Sample Error Message',
  },
  retry: 2,
  handleRetry,
};
