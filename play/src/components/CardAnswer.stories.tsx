import React, { useState } from "react";
import { GameSessionState } from '@righton/networking';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CardAnswer from './CardAnswer';


export default {
  title: 'Design System/3_Organisms/CardAnswer',
  component: CardAnswer,
} as ComponentMeta<typeof CardAnswer>;

const Template: ComponentStory<typeof CardAnswer> = (args) => <CardAnswer {...args} />;

export const CorrectAnswer = Template.bind({});
console.log(CorrectAnswer)

CorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, 
  answers: [{text: "Answer 1", isCorrectAnswer: true}, {text: "Answer 2", isCorrectAnswer: false}, {text: "Answer 3", isCorrectAnswer: false}, {text: "Answer 4", isCorrectAnswer: false}],
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER, 
  answers: [{text: "Answer 1", isCorrectAnswer: true}, {text: "Answer 2", isCorrectAnswer: false}, {text: "Answer 3", isCorrectAnswer: false}, {text: "Answer 4", isCorrectAnswer: false}],
};