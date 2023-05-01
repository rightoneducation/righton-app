import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import IntroButtonStyled from './IntroButtonStyled';
import Theme from '../Theme';

export default {
  title: 'Design System/1_Atoms/IntroButtonStyled',
  component: IntroButtonStyled,
} as ComponentMeta<typeof IntroButtonStyled>;

const Template: ComponentStory<typeof IntroButtonStyled> =
  function ButtonSubmitAnswerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <IntroButtonStyled {...args}>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Join Game
          </Typography>
        </IntroButtonStyled>
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
