import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import Card from './Card';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/Card',
  component: Card,
} as Meta<typeof Card>;

const Template: StoryFn<typeof Card> = function CardTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <Card {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const BottomText1 = Template.bind({});

BottomText1.args = {
  bottomText: "Bottom Text 1",
};

export const BottomText2 = Template.bind({});

BottomText2.args = {
  bottomText: "Bottom Text 2",
};
