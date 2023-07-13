import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import AnswerSelector from './AnswerSelector';
import { AnswerState } from '../lib/PlayModels';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/2_Molecules/AnswerSelector',
  component: AnswerSelector,
} as Meta<typeof AnswerSelector>;

const Template: StoryFn<typeof AnswerSelector> =
  function AnswerSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <AnswerSelector {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  answerStatus: AnswerState.DEFAULT,
  isSubmitted: false,
  answerText: 'Sample',
  index: 0,
};
