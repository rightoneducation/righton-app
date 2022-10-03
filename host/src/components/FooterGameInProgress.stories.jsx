import React from "react";
import FooterGameInProgress from "./FooterGameInProgress.jsx";

export default {
  title: "FooterGameInProgress",
  component: FooterGameInProgress
};

const Template = args => <FooterGameInProgress {...args} />;

export const Phase1 = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase1.args = {
  numPlayers: 0,
  numAnswers: 0,
  currentState: "INITIAL_INTRO"
};

export const Phase2 = Template.bind({});
Phase2.args = {
  numPlayers: 7,
  numAnswers: 2,
  currentState: "REVIEWING_RESULT"
};

export const Phase3 = Template.bind({});
Phase3.args = {
  numPlayers: 8,
  numAnswers: 5,
  currentState: "CHOOSING_TRICK_ANSWER"
};

export const Phase4 = Template.bind({});
Phase4.args = {
  numPlayers: 9,
  numAnswers: 7,
  currentState: "FINISHED"
};
