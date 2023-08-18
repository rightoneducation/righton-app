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
    { label: 'A', count: 10, answer: '4x^4 − x^3 + 7x^2 − 6x'  },
    { label: 'B', count: 20, answer: '2x^4 + 6x^2 − 3x' },
    { label: 'C', count: 15, answer: 'x^2 − 4x − 12' },
    { label: 'D', count: 0, answer: 'x^9 + 3x -15' },
  ],
  numPlayers: 55,
  totalAnswers: 45,
  currentState: 'CHOOSE_CORRECT_ANSWER',
  questionChoices: [
    { isAnswer: false, text: 'A' },
    { isAnswer: true, text: 'B' },
    { isAnswer: false, text: 'C' },
    { isAnswer: false, text: 'D' },
  ],
  statePosition: 1,
  teamsPickedChoices: [
    { teamName: 'Team A', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Team B', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Team C', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
  // ... Other arrays for different answers
],
};

export const sameAnswer = Template.bind({});
sameAnswer.args = {
  ...gameSession,
  studentResponses: [
    { label: 'A', count: 0, answer: '4x^4 − x^3 + 7x^2 − 6x'  },
    { label: 'B', count: 0, answer: '2x^4 + 6x^2 − 3x' },
    { label: 'C', count: 10, answer: 'x^2 − 4x − 12' },
    { label: 'D', count: 0, answer: 'x^9 + 3x -15' },
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
    { label: 'A', count: 0, answer: '4x^4 − x^3 + 7x^2 − 6x'  },
    { label: 'B', count: 0, answer: '2x^4 + 6x^2 − 3x' },
    { label: 'C', count: 0, answer: 'x^2 − 4x − 12' },
    { label: 'D', count: 1, answer: 'x^9 + 3x -15' },
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
    { label: 'A', count: 0, answer: '4x^4 − x^3 + 7x^2 − 6x'  },
    { label: 'B', count: 0, answer: '2x^4 + 6x^2 − 3x' },
    { label: 'C', count: 0, answer: 'x^2 − 4x − 12' },
    { label: 'D', count: 0, answer: 'x^9 + 3x -15' },
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
    { label: 'A', count: 0, answer: '4x^4 − x^3 + 7x^2 − 6x'  },
    { label: 'B', count: 3, answer: '2x^4 + 6x^2 − 3x' },
    { label: 'C', count: 1, answer: 'x^2 − 4x − 12' },
    { label: 'D', count: 0, answer: 'x^9 + 3x -15' },
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
    { label: 'A', count: 0, answer: '4x^4 − x^3 + 7x^2 − 6x'  },
    { label: 'B', count: 3, answer: '2x^4 + 6x^2 − 3x' },
    { label: 'C', count: 1, answer: 'x^2 − 4x − 12' },
    { label: 'D', count: 1, answer: 'x^9 + 3x -15' },
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