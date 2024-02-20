import React from 'react';
import {
  IGameSession,
  GameSessionState,
  AWSGameSession,
  GameSessionParser,
  IChoice,
} from '@righton/networking';
import { StoryFn, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { I18nextProvider } from 'react-i18next';
import PhaseResults from './PhaseResults';
import MockGameSession from '../mock/MockGameSession.json';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/4_Pages/PhaseResults',
  component: PhaseResults,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof PhaseResults>;

const Template: StoryFn<typeof PhaseResults> = function PhaseResultsTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <PhaseResults {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as AWSGameSession
) as IGameSession;

const answerChoices = gameSession.questions[0].choices.map(
  (choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  })
);

export const PhaseOne = Template.bind({});
PhaseOne.args = {
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_1_RESULTS,
  teamAvatar: 0,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  gameSession,
  answerChoices,
};

export const PhaseTwo = Template.bind({});
PhaseTwo.args = {
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_2_RESULTS,
  teamAvatar: 0,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  gameSession,
  answerChoices,
};
