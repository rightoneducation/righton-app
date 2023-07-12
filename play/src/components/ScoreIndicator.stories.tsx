import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import ScoreIndicator from './ScoreIndicator';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/1_Atoms/ScoreIndicator',
  component: ScoreIndicator,
} as Meta<typeof ScoreIndicator>;

const Template: StoryFn<typeof ScoreIndicator> =
  function ScoreIndicatorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <ScoreIndicator {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  score: 120,
  newPoints: 10,
};
