import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import FooterContent from './FooterContent';
import Theme from '../../lib/Theme';
import i18n from '../../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/FooterContent',
  component: FooterContent,
} as Meta<typeof FooterContent>;

const Template: StoryFn<typeof FooterContent> = function FooterContentTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <FooterContent {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const footerBeginQuestion = Template.bind({});

footerBeginQuestion.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Begin Question",
    phaseOneTime: 180,
    phaseTwoTime: 180
};

export const footerContinue = Template.bind({});

footerContinue.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Continue",
    phaseOneTime: 180,
    phaseTwoTime: 180
};

export const footerGoResults = Template.bind({});

footerGoResults.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Go to Results",
    phaseOneTime: 180,
    phaseTwoTime: 180
};

export const footerGoPhase2 = Template.bind({});

footerGoPhase2.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Go to Phase 2",
    phaseOneTime: 180,
    phaseTwoTime: 180
};
export const footerStartPhase2Question = Template.bind({});

footerStartPhase2Question.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Start Phase 2 Question",
    phaseOneTime: 180,
    phaseTwoTime: 180
};

export const footerGoNextQuestion = Template.bind({});

footerGoNextQuestion.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Go to Next Question",
    phaseOneTime: 180,
    phaseTwoTime: 180
};

export const footerProceedRightOnCentral = Template.bind({});

footerProceedRightOnCentral.args = {
    inputNum: 4,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "Proceed to RightOn Central",
    phaseOneTime: 180,
    phaseTwoTime: 180
};

export const footerEndAnswering = Template.bind({});

footerEndAnswering.args = {
    inputNum: 3,
    totalNum: 4,
    footerBar: "CHOOSE_CORRECT_ANSWER",
    footerButtonText: "End Answering",
    phaseOneTime: 180,
    phaseTwoTime: 180
};


