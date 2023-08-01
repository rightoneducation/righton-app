import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import ErrorModal from './ErrorModal';
import { ErrorType } from '../lib/PlayModels';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/2_Molecules/ErrorModal',
  component: ErrorModal,
} as Meta<typeof ErrorModal>;

const Template: StoryFn<typeof ErrorModal> = function ErrorModalTemplate(
  args
) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n} defaultNS="translation">
          <ErrorModal {...args} />
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

let retryCount = 0;
const handleRetry = () => {
  retryCount += 1;
};

export const InitialError = Template.bind({});

InitialError.args = {
  isModalOpen: true,
  errorType: ErrorType.CONNECT,
  errorText: 'Sample Error Message',
  retry: retryCount,
  handleRetry,
};

export const RetriedTwice = Template.bind({});
RetriedTwice.args = {
  isModalOpen: true,
  errorType: ErrorType.CONNECT,
  errorText: 'Sample Error Message',
  retry: 2,
  handleRetry,
};

export const AnswerError = Template.bind({});
AnswerError.args = {
  isModalOpen: true,
  errorType: ErrorType.ANSWER,
  retry: 2,
  handleRetry,
};

export const ConfidenceError = Template.bind({});
AnswerError.args = {
  isModalOpen: true,
  errorType: ErrorType.CONFIDENCE,
  retry: 2,
  handleRetry,
};

export const ScoreError = Template.bind({});
ScoreError.args = {
  isModalOpen: true,
  errorType: ErrorType.SCORE,
  retry: 2,
  handleRetry,
};
