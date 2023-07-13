import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import FooterContent from './FooterContent';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/FooterContent',
  component: FooterContent,
} as Meta<typeof FooterContent>;

const Template: StoryFn<typeof FooterContent> =
  function FooterContentTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <FooterContent {...args} />
        </I18nextProvider>
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
  score: 0,
};
