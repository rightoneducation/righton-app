import React from 'react';
import { GameSessionParser } from '@righton/networking';
import MockGameSession from "../mock/MockGameSession.json";
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
  responses: [
    { label: '-', count: 5},
    { label: 'A', count: 10 },
    { label: 'B', count: 15 },
    { label: 'C', count: 5 },
    { label: 'D', count: 20 },
  ],
};

export const sameAnswer = Template.bind({});
sameAnswer.args = {
  ...gameSession,
  responses: [
    { label: '-', count: 0},
    { label: 'A', count: 0 },
    { label: 'B', count: 20 },
    { label: 'C', count: 0 },
    { label: 'D', count: 0 },
  ],
};

export const oneAnswer = Template.bind({});
oneAnswer.args = {
  ...gameSession,
  responses: [
    { label: '-', count: 0},
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 0 },
    { label: 'D', count: 1 },
  ],
};

export const noAnswer = Template.bind({});
noAnswer.args = {
  ...gameSession,
  responses: [
    { label: '-', count: 0},
    { label: 'A', count: 0 },
    { label: 'B', count: 0 },
    { label: 'C', count: 0 },
    { label: 'D', count: 0 },
  ],
};
