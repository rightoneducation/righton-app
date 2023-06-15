import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import ErrorModal from "./ErrorModal";
import Theme from "../lib/Theme";
import { ErrorType } from "../lib/PlayModels";

export default {
  title: "Design System/2_Molecules/ErrorModal",
  component: ErrorModal,
} as ComponentMeta<typeof ErrorModal>;

const Template: ComponentStory<typeof ErrorModal> = function ErrorModalTemplate(
  args
) {
  return (
    <I18nextProvider i18n={i18n} defaultNS="translation">
      <BrowserRouter>
        <ThemeProvider theme={Theme}>
          <ErrorModal {...args} />
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
  isModalOpen: true,
  errorType: ErrorType.CONNECT,
  errorText: "Sample Error Message",
  retry: retryCount,
  handleRetry,
};

export const RetriedTwice = Template.bind({});
RetriedTwice.args = {
  isModalOpen: true,
  errorType: ErrorType.CONNECT,
  errorText: "Sample Error Message",
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

export const ScoreError = Template.bind({});
ScoreError.args = {
  isModalOpen: true,
  errorType: ErrorType.SCORE,
  retry: 2,
  handleRetry,
};
