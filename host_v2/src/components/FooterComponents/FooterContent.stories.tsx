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

const Template: StoryFn<typeof FooterContent> = function FooterContentTemplate(
  args,
) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <FooterContent {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const DarkBarChooseCorrectAnswerState = Template.bind({});

DarkBarChooseCorrectAnswerState.args = {
  inputNum: 4,
  totalNum: 4,
  footerBar: 'CHOOSE_CORRECT_ANSWER',
  footerButtonText: 'Continue',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const DarkBarChooseTrickestAnswerState = Template.bind({});

DarkBarChooseTrickestAnswerState.args = {
  inputNum: 1,
  totalNum: 4,
  footerBar: 'CHOOSE_TRICKIEST_ANSWER',
  footerButtonText: 'Continue',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterBeginQuestion = Template.bind({});

FooterBeginQuestion.args = {
  inputNum: 3,
  totalNum: 4,
  footerBar: 'NOT_STARTED',
  footerButtonText: 'Begin Question',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterContinue = Template.bind({});

FooterContinue.args = {
  inputNum: 2,
  totalNum: 4,
  footerBar: 'NOT_STARTED',
  footerButtonText: 'Continue',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterGoResults = Template.bind({});

FooterGoResults.args = {
  inputNum: 4,
  totalNum: 4,
  footerBar: 'NOT_STARTED',
  footerButtonText: 'Go to Results',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterGoPhase2 = Template.bind({});

FooterGoPhase2.args = {
  inputNum: 4,
  totalNum: 4,
  footerBar: 'TEAMS_JOINING',
  footerButtonText: 'Go to Phase 2',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};
export const FooterStartPhase2Question = Template.bind({});

FooterStartPhase2Question.args = {
  inputNum: 4,
  totalNum: 4,
  footerBar: 'TEAMS_JOINING',
  footerButtonText: 'Start Phase 2 Question',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterGoNextQuestion = Template.bind({});

FooterGoNextQuestion.args = {
  inputNum: 4,
  totalNum: 4,
  footerBar: 'PHASE_1_DISCUSS',
  footerButtonText: 'Go to Next Question',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterProceedRightOnCentral = Template.bind({});

FooterProceedRightOnCentral.args = {
  inputNum: 4,
  totalNum: 4,
  footerBar: 'PHASE_1_DISCUSS',
  footerButtonText: 'Proceed to RightOn Central',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};

export const FooterEndAnswering = Template.bind({});

FooterEndAnswering.args = {
  inputNum: 3,
  totalNum: 4,
  footerBar: 'FINAL_RESULTS',
  footerButtonText: 'End Answering',
  phaseOneTime: 180,
  phaseTwoTime: 180,
};
