import React from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionState,
  GameSessionParser,
  IChoice,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { StoryFn, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import GameInProgress from './GameInProgress';
import MockGameSession from '../mock/MockGameSession.json';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/4_Pages/GameInProgress',
  component: GameInProgress,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof GameInProgress>;

const Template: StoryFn<typeof GameInProgress> =
  function GameInProgressTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <GameInProgress {...args} />
        </I18nextProvider>
      </ThemeProvider>
    );
  };

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as IAWSGameSession
) as IGameSession;

const answerChoices = gameSession.questions[0].choices!.map( // eslint-disable-line @typescript-eslint/no-non-null-assertion
  (choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  })
);

export const ChooseCorrectAnswer = Template.bind({});
ChooseCorrectAnswer.args = {
  teamAvatar: 0,
  teams: gameSession.teams,
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  answerChoices,
};

export const ChooseTrickiestAnswer = Template.bind({});
ChooseTrickiestAnswer.args = {
  teamAvatar: 0,
  teams: gameSession.teams,
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  answerChoices,
};

export const DiscussPhase1 = Template.bind({});
DiscussPhase1.args = {
  teamAvatar: 0,
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_1_DISCUSS,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  answerChoices,
};

export const DiscussPhase2 = Template.bind({});
DiscussPhase2.args = {
  teamAvatar: 0,
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_2_DISCUSS,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: '2d609343-de50-4830-b65e-71eb72bb9bef',
  answerChoices,
};
