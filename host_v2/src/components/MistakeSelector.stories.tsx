import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import MistakeSelector from './MistakeSelector';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/3_Organisms/MistakeSelector',
  component: MistakeSelector,
} as Meta<typeof MistakeSelector>;

const Template: StoryFn<typeof MistakeSelector> = function CardTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <MistakeSelector {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const PopularMode = Template.bind({});
PopularMode.args = {
  mistakeText: '4x^4 - x^3 + 7x^2 - 6x',
  mistakePercent: 100,
  mistakeIndex: 0,
  isPopularMode: true,
  isSelected: true,
};

// need to display circle
export const PopularMode1 = Template.bind({});
PopularMode1.args = {
  mistakeText: '2x^4 + 6x^2 - 3x',
  mistakePercent: 80,
  mistakeIndex: 1,
  isPopularMode: true,
  isSelected: true,
};

export const PopularMode2 = Template.bind({});
PopularMode2.args = {
  mistakeText: 'No Idea',
  mistakePercent: 40,
  mistakeIndex: 2,
  isPopularMode: true,
  isSelected: true,
};

export const ManualSelected = Template.bind({});
ManualSelected.args = {
  mistakeText: 'x^2 - 4x - 12',
  mistakePercent: 20,
  mistakeIndex: 3,
  isPopularMode: true,
  isSelected: true,
};
