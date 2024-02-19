import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import QuestionCard from './QuestionCard';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/Card',
  component: QuestionCard,
} as Meta<typeof QuestionCard>;

const Template: StoryFn<typeof QuestionCard> = function CardTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <QuestionCard {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const questionCard1 = Template.bind({});

questionCard1.args = {
  questionText: "A pair of shoes were 10% off last week. This week, theres an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that youd get if you buy the shoes this week?",
  imageUrl: "https://images.unsplash.com/photo-1609188944094-394637c26769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
};

export const questionCard2 = Template.bind({});

questionCard2.args = {
  questionText: "A sample question without an image",
  imageUrl: undefined
};
