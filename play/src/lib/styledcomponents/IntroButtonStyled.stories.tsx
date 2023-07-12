import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import IntroButtonStyled from './IntroButtonStyled';
import Theme from '../Theme';
import i18n from '../../i18n.mock';

export default {
  title: 'Design System/1_Atoms/IntroButtonStyled',
  component: IntroButtonStyled,
} as Meta<typeof IntroButtonStyled>;

const Template: StoryFn<typeof IntroButtonStyled> =
  function ButtonSubmitAnswerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <IntroButtonStyled {...args}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
              Join Game
            </Typography>
          </IntroButtonStyled>
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const SplashScreen = Template.bind({});
SplashScreen.args = {
  style: {
    background: `${Theme.palette.primary.highlightGradient}`,
    boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
  },
};
export const Default = Template.bind({});
Default.args = {};
