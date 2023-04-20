import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import JoinGame from './JoinGame';
import { JoinGameState } from '../lib/PlayModels';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/4_Pages/JoinGame',
  component: JoinGame,
} as ComponentMeta<typeof JoinGame>;

const Template: ComponentStory<typeof JoinGame> =
  function JoinGameTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <JoinGame {...args} />
      </ThemeProvider>
    );
  };

export const SplashScreen = Template.bind({});
SplashScreen.args = {
  joinGameState: JoinGameState.SPLASHSCREEN,
};

export const EnterGameCode = Template.bind({});
EnterGameCode.args = {
  joinGameState: JoinGameState.ENTERGAMECODE,
};

export const EnterPlayerName = Template.bind({});
EnterPlayerName.args = {
  joinGameState: JoinGameState.ENTERNAME,
};

export const SelectAvatar = Template.bind({});
SelectAvatar.args = {
  joinGameState: JoinGameState.SELECTAVATAR,
};

export const HowToPlay = Template.bind({});
HowToPlay.args = {
  joinGameState: JoinGameState.HOWTOPLAY,
};