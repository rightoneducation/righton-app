import React from "react";
import FooterGame from "./FooterGame.jsx";

export default {
  title: "FooterGame",
  component: FooterGame
};

const Template = args => <FooterGame {...args} />;

export const Phase1 = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Phase1.args = {
  numPlayers: 0,
  totalAnswers: 0,
  currentState: "INITIAL_INTRO",
  footerButtonText: "Continue",
  gameTimer: true
};

export const Phase2 = Template.bind({});
Phase2.args = {
  numPlayers: 7,
  totalAnswers: 2,
  currentState: "REVIEWING_RESULT",
  footerButtonText: "Go to Phase 2",
  gameTimer: false
};

export const Phase3 = Template.bind({});
Phase3.args = {
  numPlayers: 8,
  totalAnswers: 5,
  currentState: "CHOOSING_TRICK_ANSWER",
  footerButtonText: "Continue",
  gameTimer: true
};

export const Phase4 = Template.bind({});
Phase4.args = {
  numPlayers: 9,
  totalAnswers: 7,
  currentState: "FINISHED",
  footerButtonText: "Go to Next Question",
  gameTimer: false
};
