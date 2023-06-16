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

export const Default = Template.bind({});
Default.args = {
  isSubmitted: false,
  isSelected: false,
};