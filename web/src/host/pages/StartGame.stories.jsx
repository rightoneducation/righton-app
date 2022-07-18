import React, { useState } from 'react';
import StartGame from './StartGame';
import MockGameSession from '../../mocks/gamesession.json';

export default {
  title: 'StartGame',
  component: StartGame,
  argTypes: { handleSkipToResults: { action: 'handleSkipToResults' } },
}

const Template = (args) => {
  const [teamsState, setTeamsState] = useState(args.teams.items);
  const removeTeam = (index) => {
    setTeamsState([...teamsState.slice(0, index), ...teamsState.slice(index + 1, teamsState.length)]);
  }

  return <StartGame {...args} teams={{ items: teamsState }} removeTeam={removeTeam} />
};

export const Initial = Template.bind({});
Initial.args = {
  ...MockGameSession,
  currentState: "INITAL_INTRO",
  currentQuestionId: 1,
  teams: {
    items: []
  }
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