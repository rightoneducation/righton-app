import React from 'react';
import { GameSessionParser } from '@righton/networking';
import MockGameSession from '../../mock/MockGameSession.json'
import ResponsesGraph from './ResponsesGraph';

export default {
  title: 'ResponsesGraph',
  component: ResponsesGraph,
};

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(MockGameSession);

const Template = args => <ResponsesGraph {...args} />;

export const differentAnswers = Template.bind({});
differentAnswers.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 10 },
    { label: 'B', count: 15 },
    { label: 'C', count: 5 },
    { label: 'D', count: 20 },
  ],
  numPlayers: 55,
  totalAnswers: 50,
  currentState: 'CHOOSE_CORRECT_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 1,
};

export const sameAnswer = Template.bind({});
sameAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 10 },
    { label: 'D', count: 0 },
  ],
  numPlayers: 10,
  totalAnswers: 10,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const oneAnswer = Template.bind({});
oneAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 0 },
    { label: 'D', count: 1 },
  ],
  numPlayers: 1,
  totalAnswers: 1,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const noAnswer = Template.bind({});
noAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 0 },
    { label: 'D', count: 0 },
  ],
  numPlayers: 10,
  totalAnswers: 0,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const lessThanFivePlayers = Template.bind({});
lessThanFivePlayers.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 3 },
    { label: 'C', count: 0 },
    { label: 'D', count: 1 },
  ],
  numPlayers: 4,
  totalAnswers: 4,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};

export const fivePlayers = Template.bind({});
fivePlayers.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0 },
    { label: 'B', count: 3 },
    { label: 'C', count: 1 },
    { label: 'D', count: 1 },
  ],
  numPlayers: 5,
  totalAnswers: 5,
  currentState: 'CHOOSE_TRICKEST_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 6,
};