import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import RejoinModal from './RejoinModal';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/2_Molecules/RejoinModal',
  component: RejoinModal,
} as Meta<typeof RejoinModal>;

const Template: StoryFn<typeof RejoinModal> = function RejoinModalTemplate(
  args
) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n} defaultNS="translation">
          <RejoinModal {...args} />
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export const Default = Template.bind({});
Default.args = {
  isModalVisible: true,
};
