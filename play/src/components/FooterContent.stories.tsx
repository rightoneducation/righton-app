import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import FooterContent from './FooterContent';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/3_Organisms/FooterContent',
  component: FooterContent,
} as ComponentMeta<typeof FooterContent>;

const Template: ComponentStory<typeof FooterContent> =
  function FooterContentTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <FooterContent {...args} />
      </ThemeProvider>
    );
  };

export const Team0 = Template.bind({});
Team0.args = {
  avatar: 0,
  teamName: 'Edward Hopper',
  newPoints: 0,
  score: 9,
};

export const Team1 = Template.bind({});
Team1.args = {
  avatar: 1,
  teamName: 'Mark Rothko',
  newPoints: 10,
  score: 120,
};

export const Team2 = Template.bind({});
Team2.args = {
  avatar: 2,
  teamName: 'Gustave Caillebotte',
  newPoints: 50,
  score: 240,
};

export const Team3 = Template.bind({});
Team3.args = {
  avatar: 3,
  teamName: 'Katsushika Hokusai',
  newPoints: 0,
  score: 99,
};

export const Team4 = Template.bind({});
Team4.args = {
  avatar: 4,
  teamName: 'Andrew Wyeth',
  newPoints: 100,
  score: 1200,
};

export const Team5 = Template.bind({});
Team5.args = {
  avatar: 5,
  teamName: 'Michelangelo Caravaggio',
  newPoints: 10,
  score: null,
};
