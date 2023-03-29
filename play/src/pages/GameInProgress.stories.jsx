import React, { useState } from "react";
import { GameSessionState } from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json'
import GameInProgress from "./GameInProgress";

export default {
  title: 'Design System/4_Pages/GameInProgress',
  component: GameInProgress
};
const handleTimerIsFinished = () => {
  console.log('finished');
};

const Template = args => <GameInProgress {...args} />;

export const ChooseCorrectAnswer = Template.bind({});
ChooseCorrectAnswer.args = {
  ...MockGameSession
};

