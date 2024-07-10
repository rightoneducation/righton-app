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
  MockGameSession as unknown as AWSGameSession
) as IGameSession;

const answerChoices = gameSession.questions[0].choices.map(
  (choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  })
);

