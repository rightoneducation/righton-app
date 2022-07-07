import React from 'react';
import FooterGameInProgress from './FooterGameInProgress.jsx';
import MockGameSession from '../../mocks/gamesession.json';

export default {
  title: 'FooterGameInProgress',
  component: FooterGameInProgress,
  argTypes: {handleSkipToResults: { action: 'handleSkipToResults' } },
}

const Template = (args) => <FooterGameInProgress {...args} />

export const Phase1 = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase1.args = {
  ...MockGameSession,
  currentState: "PHASE 1",
  currentQuestionId: 1,
  teams: {
    items: [
      {
        name: "Ray W",
        answered: "false"
      },
      {
        name: "Zach T",
        answered: "false"
      },
      {
        name: "Jared J",
        answered: "false"
      },
      {
        name: "Lucha E",
        answered: "false"
      },
      {
        name: "Josephina I",
        answered: "false"
      },
      {
        name: "Eric N",
        answered: "false"
      },
      {
        name: "Alex K",
        answered: "false"
      }
    ]
  }
};

export const Phase2 = Template.bind({});
Phase2.args = {
  ...MockGameSession,
  currentState: "PHASE 2",
  currentQuestionId: 2,
  teams: {
    items: [
      {
        name: "Ray W",
        answered: "false"
      },
      {
        name: "Zach T",
        answered: "true"
      },
      {
        name: "Jared J",
        answered: "false"
      },
      {
        name: "Lucha E",
        answered: "true"
      },
      {
        name: "Josephina I",
        answered: "false"
      },
      {
        name: "Eric N",
        answered: "false"
      },
      {
        name: "Alex K",
        answered: "false"
      }
    ]
  }
};

export const Phase3 = Template.bind({});
Phase3.args = {
  ...MockGameSession,
  currentState: "PHASE 3",
  currentQuestionId: 2,
  teams: {
    items: [
      {
        name: "Ray W",
        answered: "true"
      },
      {
        name: "Zach T",
        answered: "true"
      },
      {
        name: "Jared J",
        answered: "true"
      },
      {
        name: "Lucha E",
        answered: "true"
      },
      {
        name: "Josephina I",
        answered: "true"
      },
      {
        name: "Eric N",
        answered: "true"
      },
      {
        name: "Alex K",
        answered: "true"
      }
    ]
  }
};
