import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import AvatarIconStyled from './AvatarIconStyled';
import MonsterIcon from '../../img/MonsterIcon0.svg';
import i18n from '../../i18n.mock';

export default {
  title: 'Design System/1_Atoms/AvatarIconStyled',
  component: AvatarIconStyled,
} as Meta<typeof AvatarIconStyled>;

const Template: StoryFn<typeof AvatarIconStyled> =
  function AvatarIconStyledTemplate(args) {
    const theme = useTheme();

    return (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <AvatarIconStyled src={MonsterIcon} {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  isSelected: false,
};
