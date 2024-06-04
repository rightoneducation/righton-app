import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { ITeam, IQuestion,GameSessionState, GameSessionParser, 
    APIClients, Environment,
    IGameSession, } from '@righton/networking';
import { I18nextProvider } from 'react-i18next';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';
import CurrentStudents from './CurrentStudents';
import MockOnePlayer from '../mock/MockOnePlayer.json';


const gameSession = GameSessionParser.gameSessionFromAWSGameSession({...MockOnePlayer, 
    currentState: MockOnePlayer.currentState as GameSessionState}); 

export default {
  title: 'Design System/1_Atoms/PlayerIcon',
  component: CurrentStudents,
} as Meta<typeof CurrentStudents>;


const Template: StoryFn<typeof CurrentStudents> =
  function CurrentStudentsTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <CurrentStudents {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };
export const OneStudent = Template.bind({});
OneStudent.args = {
  teams: gameSession.teams,
  handleDeleteTeam: (id: string) => console.log(`Delete team ${id}`),
};

