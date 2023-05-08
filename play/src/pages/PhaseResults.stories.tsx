import React from 'react';
import {
  IGameSession,
  GameSessionState,
  IAWSGameSession,
  GameSessionParser,
} from '@righton/networking';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import PhaseResults from './PhaseResults';
import MockGameSession from '../mock/MockGameSession.json';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/4_Pages/PhaseResults',
  component: PhaseResults,
} as ComponentMeta<typeof PhaseResults>;

const Template: ComponentStory<typeof PhaseResults> =
  function PhaseResultsTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <PhaseResults {...args} />
      </ThemeProvider>
    );
  };

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as IAWSGameSession
) as IGameSession;

export const PhaseOne = Template.bind({});
PhaseOne.args = {
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_1_RESULTS,
  teamAvatar: 0,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  gameSession,
};

export const PhaseTwo = Template.bind({});
PhaseTwo.args = {
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_2_RESULTS,
  teamAvatar: 0,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  gameSession,
};
