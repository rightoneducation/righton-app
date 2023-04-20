import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { IntroButton } from './StyledComponents';
import Theme from '../Theme';

export default {
  title: 'Design System/1_Atoms/IntroButton',
  component: IntroButton,
} as ComponentMeta<typeof IntroButton>;

const Template: ComponentStory<typeof IntroButton> =
  function ButtonSubmitAnswerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <IntroButton {...args}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Join Game
          </Typography>
          </IntroButton>
      </ThemeProvider>
    );
  };

export const SplashScreen = Template.bind({});
SplashScreen.args = {
  style: { 
    background: `${Theme.palette.primary.highlightGradient}`,
    boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
    }
};
export const Default = Template.bind({});
Default.args = {
};
