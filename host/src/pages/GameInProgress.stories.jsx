import React from "react";
import { GameSessionParser } from '@righton/networking';
import GameInProgress from "./GameInProgress";
import MockGameSession from "../mock/MockGameSession.json";

export default {
  title: "GameInProgress",
  component: GameInProgress
};
const gameSession = GameSessionParser.gameSessionFromAWSGameSession(MockGameSession);
const Template = args => <GameInProgress {...args} />;

export const Initial = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Initial.args = {
  ...gameSession,
  currentState: "CHOOSE_CORRECT_ANSWER",
  currentQuestionId: 0,
  questions: gameSession.questions,
  teamsArray: gameSession.teams
};

export const SecondQuestion = Template.bind({});
SecondQuestion.args = {
  ...gameSession,
  currentState: "CHOOSE_TRICKIEST_ANSWER",
  currentQuestionId: 1,
  questions: gameSession.questions,
  teamsArray: gameSession.teams
};
