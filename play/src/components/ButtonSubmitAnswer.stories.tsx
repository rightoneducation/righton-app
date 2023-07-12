import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/1_Atoms/SmallButton',
  component: ButtonSubmitAnswer,
} as Meta<typeof ButtonSubmitAnswer>;

const Template: StoryFn<typeof ButtonSubmitAnswer> =
  function ButtonSubmitAnswerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <ButtonSubmitAnswer {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  isSubmitted: false,
  isSelected: false,
};
