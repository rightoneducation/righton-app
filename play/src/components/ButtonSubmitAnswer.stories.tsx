import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/1_Atoms/SmallButton',
  component: ButtonSubmitAnswer,
} as ComponentMeta<typeof ButtonSubmitAnswer>;

const Template: ComponentStory<typeof ButtonSubmitAnswer> =
  function ButtonSubmitAnswerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <ButtonSubmitAnswer {...args} />
      </ThemeProvider>
    );
  };

export const DefaultState = Template.bind({});
DefaultState.args = {
  isSubmitted: false,
  isSelected: false,
};

export const AnswerSelected = Template.bind({});
AnswerSelected.args = {
  isSelected: true,
  isSubmitted: false,
};

export const AnswerSubmitted = Template.bind({});
AnswerSubmitted.args = {
  isSelected: true,
  isSubmitted: true,
};
