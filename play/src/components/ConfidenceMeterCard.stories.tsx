import React from 'react';
import { GameSessionState } from '@righton/networking';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import ConfidenceMeterCard from './ConfidenceMeterCard';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/3_Organisms/ConfidenceMeterCard',
  component: ConfidenceMeterCard,
} as ComponentMeta<typeof ConfidenceMeterCard>;

const Template: ComponentStory<typeof ConfidenceMeterCard> = function ConfidenceMeterCardTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <ConfidenceMeterCard {...args} />
    </ThemeProvider>
  );
};

// no input i.e. no selected option without sending response text
export const noSelection = Template.bind({});
noSelection.args = {
  selectedOption: null,
  isSelected: false
}

// different inputs with sending response text
export const notAtAll = Template.bind({});
notAtAll.args = {
  selectedOption: 0,
  isSelected: true
}

export const kinda = Template.bind({});
kinda.args = {
  selectedOption: 1,
  isSelected: true
}

export const quite = Template.bind({});
quite.args = {
  selectedOption: 2,
  isSelected: true
}

export const very = Template.bind({});
very.args = {
  selectedOption: 3,
  isSelected: true
}

export const totally = Template.bind({});
totally.args = {
  selectedOption: 4,
  isSelected: true
}