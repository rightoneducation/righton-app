import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { AvatarIcon } from './StyledComponents';
import  MonsterIcon from '../../img/MonsterIcon0.svg';
import Theme from '../Theme';

export default {
  title: 'Design System/1_Atoms/AvatarIcon',
  component: AvatarIcon,
} as ComponentMeta<typeof AvatarIcon>;



const Template: ComponentStory<typeof AvatarIcon> =
  function AvatarIconTemplate(args) {
    const theme = useTheme();
   

    return (
      <ThemeProvider theme={Theme}>
       <AvatarIcon src={MonsterIcon} {...args}
        />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  isSelected: false,
};



