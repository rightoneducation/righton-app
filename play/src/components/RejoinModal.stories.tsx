import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import RejoinModal from './RejoinModal';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/2_Molecules/RejoinModal',
  component: RejoinModal,
} as ComponentMeta<typeof RejoinModal>;

const Template: ComponentStory<typeof RejoinModal> = function RejoinModalTemplate(
  args
) {
  return (
    <I18nextProvider i18n={i18n} defaultNS="translation">
      <BrowserRouter>
        <ThemeProvider theme={Theme}>
          <RejoinModal {...args} />
        </ThemeProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  isModalVisible: true,
};

