import React from 'react';
import StartGame from './StartGame';
import MockGameSession from '../../mocks/gamesession.json';

export default {
  title: 'StartGame',
  component: StartGame,
   argTypes: { handleSkipToResults: { action: 'handleSkipToResults' } },
}
  
const Template = (args) => <StartGame {...args} />

export const Initial = Template.bind({});
Initial.args = {
     ...MockGameSession,
     currentState: "INITAL_INTRO",
     currentQuestionId: 1,
};

export const ThreePlayers = Template.bind({});
ThreePlayers.args = {
     ...MockGameSession,
     currentState: "INITAL_INTRO",
     currentQuestionId: 1,
     teams: {
      items: [
        {
          name: "Ray W" 
        },
        {
          name: "Zach T"
        },
        {
          name: "Jared J"
        }
      ]
    }
};

export const FivePlayers = Template.bind({});
FivePlayers.args = {
     ...MockGameSession,
     currentState: "INITAL_INTRO",
     currentQuestionId: 1,
     teams: {
      items: [
        {
          name: "Ray W" 
        },
        {
          name: "Zach T"
        },
        {
          name: "Jared J"
        },
        {
          name: "Lucah E"
        },
        {
          name: "Josephina I"
        }
      ]
    }
};