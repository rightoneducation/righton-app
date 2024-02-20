import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import {
  IGameSession,
  AWSGameSession,
  GameSessionParser,
} from '@righton/networking';
import { I18nextProvider } from 'react-i18next';
import MockGameSession from '../../mock/MockGameSession.json';
import Leaderboard from './Leaderboard';
import Theme from '../../lib/Theme';
import i18n from '../../i18n.mock';

export default {
  title: 'Design System/4_Pages/FinalResults_Leaderboard',
  component: Leaderboard,
} as Meta<typeof Leaderboard>;

const Template: StoryFn<typeof Leaderboard> = function LeaderboardTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <Leaderboard {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as AWSGameSession
) as IGameSession;

export const Default = Template.bind({});
Default.args = {
  teams: gameSession.teams,
  teamAvatar: 0,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
};
