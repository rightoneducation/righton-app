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

export const PhaseOne = Template.bind({});
PhaseOne.args = {
  ...gameSession,
  responses: [
    { label: '-', count: 5},
    { label: 'A', count: 10 },
    { label: 'B', count: 15 },
    { label: 'C', count: 5 },
    { label: 'D', count: 20 },
  ],
  numPlayers: 0,
  totalAnswers: 0,
  currentState: "INITIAL_INTRO",
};

