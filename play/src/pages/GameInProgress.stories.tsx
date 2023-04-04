import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IGameSession, IAWSGameSession, GameSessionParser } from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json'
import GameInProgress from "./GameInProgress";

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(MockGameSession as IAWSGameSession) as IGameSession;

export default {
  title: 'Design System/4_Pages/GameInProgress',
  component: GameInProgress
} as ComponentMeta<typeof GameInProgress>;

const Template: ComponentStory<typeof GameInProgress> = (args) => <GameInProgress {...args} />;

export const TestStoryOne = Template.bind({});
TestStoryOne.args = {
  teamAvatar: 0,
  teams: gameSession.teams,
  id: "Team One",
  currentState: gameSession.currentState,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: "2d609343-de50-4830-b65e-71eb72bb9bef"
};

export const TestStoryTwo = Template.bind({});
TestStoryTwo.args = {
  teamAvatar: 1,
  teams: gameSession.teams,
  id: "Team Two",
  currentState: gameSession.currentState,
  questions: gameSession.questions,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: "2d609343-de50-4830-b65e-13432234sfasdfsadf"
};

