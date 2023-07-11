import React from 'react';
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
  GameSessionState,
  IChoice,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { AnswerState } from '../lib/PlayModels';
import MockGameSession from '../mock/MockGameSession.json';
import DiscussAnswerCard from './DiscussAnswerCard';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/3_Organisms/DiscussAnswerCard',
  component: DiscussAnswerCard,
} as ComponentMeta<typeof DiscussAnswerCard>;

const Template: ComponentStory<typeof DiscussAnswerCard> =
  function AnswerCardTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <DiscussAnswerCard {...args} />
      </ThemeProvider>
    );
  };

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as IAWSGameSession
) as IGameSession;

const answerChoices = gameSession.questions[0].choices!.map(  // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
  instructions: currentQuestion.instructions!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  answerStatus: AnswerState.CORRECT,
  answerText: '60%',
  answerIndex: 0,
  answerReason: answerChoices[0].reason,
  currentState: GameSessionState.PHASE_1_DISCUSS,
};

export const PHASE_2_DISCUSS = Template.bind({});
PHASE_2_DISCUSS.args = {
  isPlayerCorrect: true,
  instructions: currentQuestion.instructions!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  answerStatus: AnswerState.SELECTED,
  answerText: '60%',
  answerIndex: 0,
  answerReason: answerChoices[0].reason,
  currentState: GameSessionState.PHASE_2_DISCUSS,
};
