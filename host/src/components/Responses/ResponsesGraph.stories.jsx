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
    { teamName: 'Alex Williams', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Jackson Cameron', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Jeremiah Tanaka', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Kyle Bradshaw', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Shana Quintero', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Vanessa Martinez', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Xiomara Jimenez', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },
    { teamName: 'Zander Lee', choiceText: '4x^4 − x^3 + 7x^2 − 6x' },

    { teamName: 'Alex Williams', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Jackson Cameron', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Jeremiah Tanaka', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Kyle Bradshaw', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Shana Quintero', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Vanessa Martinez', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Xiomara Jimenez', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Zander Lee', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Alex Williams', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Jackson Cameron', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Jeremiah Tanaka', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Kyle Bradshaw', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Shana Quintero', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Vanessa Martinez', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Xiomara Jimenez', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Zander Lee', choiceText: '2x^4 + 6x^2 − 3x' },

    { teamName: 'Alex Williams', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Jackson Cameron', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Jeremiah Tanaka', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Kyle Bradshaw', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Shana Quintero', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Vanessa Martinez', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Xiomara Jimenez', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Zander Lee', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Alex Williams', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Jackson Cameron', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Jeremiah Tanaka', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Kyle Bradshaw', choiceText: 'x^2 − 4x − 12' },

    { teamName: 'Alex Williams', choiceText: 'No response' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: 'No response' },
    { teamName: 'Jackson Cameron', choiceText: 'No response' },
    { teamName: 'Jeremiah Tanaka', choiceText: 'No response' },
    { teamName: 'Kyle Bradshaw', choiceText: 'No response' },
    { teamName: 'Shana Quintero', choiceText: 'No response' },
    { teamName: 'Vanessa Martinez', choiceText: 'No response' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: 'No response' },
    { teamName: 'Xiomara Jimenez', choiceText: 'No response' },
    { teamName: 'Zander Lee', choiceText: 'No response' },
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
  teamsPickedChoices: [
    { teamName: 'Alex Williams', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Jackson Cameron', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Jeremiah Tanaka', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Kyle Bradshaw', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Shana Quintero', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Vanessa Martinez', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Xiomara Jimenez', choiceText: 'x^2 − 4x − 12' },
    { teamName: 'Zander Lee', choiceText: 'x^2 − 4x − 12' },
  ]
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
  teamsPickedChoices: [
    { teamName: 'Alex Williams', choiceText: 'x^9 + 3x -15' },
  ]
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
  teamsPickedChoices: [
    { teamName: 'Alex Williams', choiceText: 'No response' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: 'No response' },
    { teamName: 'Jackson Cameron', choiceText: 'No response' },
    { teamName: 'Jeremiah Tanaka', choiceText: 'No response' },
    { teamName: 'Kyle Bradshaw', choiceText: 'No response' },
    { teamName: 'Shana Quintero', choiceText: 'No response' },
    { teamName: 'Vanessa Martinez', choiceText: 'No response' },
    { teamName: 'Vanessa Montenegro-Rodriguez', choiceText: 'No response' },
    { teamName: 'Xiomara Jimenez', choiceText: 'No response' },
    { teamName: 'Zander Lee', choiceText: 'No response' },
  ]
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
  teamsPickedChoices:[
    { teamName: 'Alex Williams', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Jackson Cameron', choiceText: '2x^4 + 6x^2 − 3x' },

    { teamName: 'Alex Williams', choiceText: 'x^2 − 4x − 12' },
  ]
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
  teamsPickedChoices:[
    { teamName: 'Alex Williams', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Alessandro DeLuca-Smith', choiceText: '2x^4 + 6x^2 − 3x' },
    { teamName: 'Jackson Cameron', choiceText: '2x^4 + 6x^2 − 3x' },

    { teamName: 'Alex Williams', choiceText: 'x^2 − 4x − 12' },

    { teamName: 'Alex Williams', choiceText: 'x^9 + 3x -15' },
  ]
};