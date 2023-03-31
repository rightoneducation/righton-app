import React, { useState } from "react";
import { GameSessionState } from '@righton/networking';
import CardAnswer from "./CardAnswer.jsx";


export default {
  title: 'Design System/3_Organisms/CardAnswer',
  component: CardAnswer,
  // decorators: [Story => {
  //   const [isSubmitted, setIsSubmitted] = useState(false);
  //   const [selectedAnswer, setSelectedAnswer] = useState(null);
    
  //   return (
  //     <Story
  //       isSubmitted={isSubmitted}
  //       selectedAnswer={selectedAnswer}
  //       handleSubmitAnswer={() => setIsSubmitted(true)}
  //       handleSelectAnswer={(index) => setSelectedAnswer(index)}
  //     />
  //   );
  // }]
};

const Template = args => <CardAnswer {...args} />;

export const CorrectAnswer = Template.bind({});
console.log(CorrectAnswer)

CorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, 
  answers: [{text: "Answer 1"}, {text: "Answer 2"}, {text: "Answer 3"}, {text: "Answer 4"}],
  // handleSelectAnswer: (index) => setSelectedAnswer(index),
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER, 
  answers: [{text: "Answer 1"}, {text: "Answer 2"}, {text: "Answer 3"}, {text: "Answer 4"}],
};