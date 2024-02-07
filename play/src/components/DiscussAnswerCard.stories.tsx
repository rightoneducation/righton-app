import React from 'react';
import {
  IGameSession,
  AWSGameSession,
  GameSessionParser,
  GameSessionState,
  IChoice,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { AnswerState } from '../lib/PlayModels';
import MockGameSession from '../mock/MockGameSession.json';
import DiscussAnswerCard from './DiscussAnswerCard';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/DiscussAnswerCard',
  component: DiscussAnswerCard,
} as Meta<typeof DiscussAnswerCard>;

const Template: StoryFn<typeof DiscussAnswerCard> =
  function AnswerCardTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <I18nextProvider i18n={i18n}>
          <DiscussAnswerCard {...args} />
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
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? '',
  })
);

const { questions } = gameSession;
const currentQuestion = questions[0];

export const PHASE_1_DISCUSS = Template.bind({});
PHASE_1_DISCUSS.args = {
  isPlayerCorrect: true,
  instructions: currentQuestion.instructions,
  answerStatus: AnswerState.CORRECT,
  answerText: '60%',
  answerIndex: 0,
  answerReason: answerChoices[0].reason,
  currentState: GameSessionState.PHASE_1_DISCUSS,
};

export const PHASE_2_DISCUSS = Template.bind({});
PHASE_2_DISCUSS.args = {
  isPlayerCorrect: true,
  instructions: currentQuestion.instructions,
  answerStatus: AnswerState.SELECTED,
  answerText: '60%',
  answerIndex: 0,
  answerReason: answerChoices[0].reason,
  currentState: GameSessionState.PHASE_2_DISCUSS,
};
