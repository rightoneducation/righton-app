import React, { useState } from 'react';
import GameInProgress from './GameInProgress';
import MockGameSession from '../../mocks/gamesession.json';
import GameDetails from '../components/AnswersInProgressDetails';

export default {
  title: 'GameInProgress',
  component: GameInProgress,
}

const Template = (args) => <GameDetails {...args} />

export const Phase1 = Template.bind({});
Phase1.args = {
  ...MockGameSession,
  gameStatus: "PHASE2",
  currentQuestionId: 1,
  questions: {
    items: [
      {
        "id": 1,
        "question": "How many degrees are in the interior angles of a stop sign?",
        "answer": "360",
        "wrongAnswers": [
          {"wrong": "8"}, 
          {"wrong": "720"}, 
          {"wrong": "1080"}]
      }
    ]
  }
}



