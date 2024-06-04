import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import FooterGameEnded from './FooterGameEnded';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/FooterGameEnded',
  component: FooterGameEnded,
} as Meta<typeof FooterGameEnded>;

const Template: StoryFn<typeof FooterGameEnded> = function SuggestedGamesTemplate(args) {
  const [isGameSelected, setIsGameSelected] = useState(false);
  
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <FooterGameEnded {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const FooterGameSelected = Template.bind({});

FooterGameSelected.args = {
  teamsLength: 3,
  isGameSelected: true
};

export const FooterGameNOTSelected = Template.bind({});
FooterGameNOTSelected.args = {
    teamsLength: 3,
    isGameSelected: false
};

