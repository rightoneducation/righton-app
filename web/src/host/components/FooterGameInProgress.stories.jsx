import React from 'react';
import FooterGameInProgress from './FooterGameInProgress.jsx';

export default {
  title: 'FooterGameInProgress',
  component: FooterGameInProgress,

}

const Template = (args) => <FooterGameInProgress {...args} />

export const Phase1 = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase1.args = {
  numPlayers: 0, 
  numAnswers: 0, 
  currentState: "PHASE 1",
};

export const Phase2 = Template.bind({});
Phase2.args = {
  numPlayers: 7, 
  numAnswers: 2, 
  currentState: "PHASE 2",
};

export const Phase3 = Template.bind({});
Phase3.args = {
  numPlayers: 9, 
  numAnswers: 9, 
  currentState: "PHASE 3",
};
