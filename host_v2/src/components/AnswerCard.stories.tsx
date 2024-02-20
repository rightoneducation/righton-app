import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import AnswerCard from './AnswerCard';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/Card',
  component: AnswerCard,
} as Meta<typeof AnswerCard>;

const Template: StoryFn<typeof AnswerCard> = function CardTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <AnswerCard {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const correctCard = Template.bind({});

correctCard.args = {
  isCorrectAnswer: true,
  answerIndex: 2,
  answerContent: '1080',
  instructions: [
    ' A stop sign is a regular octagon, a polygon with 8 congruent sides.',
    'We can create triangles within the octagon. For example, starting with any vertex, or corner, we can draw a line to each of the 5 non-adjacent vertices (or corners) of the octagon.',
    'Count the number of triangles that have been created.',
  ],
  answerReason: undefined,
};

export const incorrectCard = Template.bind({});

incorrectCard.args = {
  isCorrectAnswer: false,
  answerIndex: 0,
  answerContent: '8',
  instructions: undefined,
  answerReason:
    'Students might think that the number of sides (8) or the number of interior angles (8) is the same as the sum of the interior angles.',
};
