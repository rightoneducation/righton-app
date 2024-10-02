import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import { I18nextProvider } from 'react-i18next';
import ResultSelector from './ResultSelector';
import { AnswerState } from '../lib/PlayModels';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/2_Molecules/ResultSelector',
  component: ResultSelector,
} as Meta<typeof ResultSelector>;

const Template: StoryFn<typeof ResultSelector> =
  function ResultSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <ResultSelector {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  answerStatus: AnswerState.DEFAULT,
  percentageText: '66%',
  answerText: 'Sample',
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
};
