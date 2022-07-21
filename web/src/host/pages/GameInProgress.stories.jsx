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
        "rightAnswer": "360",
        "wrongAnswer1": "8",
        "wrongAnswer2": "720",
        "wrongAnswer3": "1080"
      }
    ]
  }
};


