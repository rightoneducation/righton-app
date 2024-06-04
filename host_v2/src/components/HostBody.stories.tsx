import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { ITeam, IQuestion,GameSessionState, GameSessionParser, 
    APIClients, Environment,
    IGameSession, } from '@righton/networking';
import { I18nextProvider } from 'react-i18next';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';
import HostBody from './HostBody';
import MockGameSession from '../mock/MockGameSession.json';


const gameSession = GameSessionParser.gameSessionFromAWSGameSession({...MockGameSession, 
    currentState: MockGameSession.currentState as GameSessionState}); 



export default {
  title: 'Design System/3_Organisms/Body',
  component: HostBody,
} as Meta<typeof HostBody>;


const Template: StoryFn<typeof HostBody> =
  function HostBodyTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <HostBody {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };
export const NoStudents = Template.bind({});
NoStudents.args = {
  teams: [],
  questions: gameSession.questions,
  title: 'Questions',
  handleDeleteTeam: (id: string) => console.log(`Delete team ${id}`),
};

export const ManyStudents = Template.bind({});
ManyStudents.args = {
  teams: gameSession.teams,
  questions: gameSession.questions,
  title: 'Questions',
  handleDeleteTeam: (id: string) => console.log(`Delete team ${id}`),
};
