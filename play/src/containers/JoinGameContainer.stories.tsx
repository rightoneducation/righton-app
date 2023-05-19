import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import JoinGameContainer from './JoinGameContainer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/4_Pages/JoinGameContainer',
  component: JoinGameContainer,
} as ComponentMeta<typeof JoinGameContainer>;

const Template: ComponentStory<typeof JoinGameContainer> =
  function JoinGameContainerTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <JoinGameContainer {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {};
