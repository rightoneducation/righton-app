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
  gameSession: gameSession
};

export const TestStoryTwo = Template.bind({});
TestStoryTwo.args = {
  teamAvatar: 1,
  gameSession: gameSession
};

