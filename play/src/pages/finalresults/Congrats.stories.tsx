import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import Congrats from './Congrats';
import Theme from '../../lib/Theme';

export default {
  title: 'Design System/4_Pages/FinalResults_Congrats',
  component: Congrats,
} as ComponentMeta<typeof Congrats>;

const Template: ComponentStory<typeof Congrats> = function CongratsTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <Congrats {...args} />
    </ThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  score: 10,
  selectedAvatar: 0,
  leader: true,
};

export const Player0 = Template.bind({});
Player0.args = {
  score: 20,
  selectedAvatar: 0,
  leader: false,
};

export const Player1 = Template.bind({});
Player1.args = {
  score: 40,
  selectedAvatar: 1,
  leader: true,
};

export const Player2 = Template.bind({});
Player2.args = {
  score: 80,
  selectedAvatar: 2,
  leader: false,
};

export const Player3 = Template.bind({});
Player3.args = {
  score: 160,
  selectedAvatar: 3,
  leader: true,
};

export const Player4 = Template.bind({});
Player4.args = {
  score: 320,
  selectedAvatar: 4,
  leader: false,
};

export const Player5 = Template.bind({});
Player5.args = {
  score: 640,
  selectedAvatar: 5,
  leader: true,
};