import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import AvatarIconStyled from './AvatarIconStyled';
import MonsterIcon from '../../img/MonsterIcon0.svg';

export default {
  title: 'Design System/1_Atoms/AvatarIconStyled',
  component: AvatarIconStyled,
} as ComponentMeta<typeof AvatarIconStyled>;

const Template: ComponentStory<typeof AvatarIconStyled> =
  function AvatarIconStyledTemplate(args) {
    const theme = useTheme();

    return (
      <ThemeProvider theme={theme}>
        <AvatarIconStyled src={MonsterIcon} {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  isSelected: false,
};