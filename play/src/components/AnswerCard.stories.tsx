import React from "react";
import { GameSessionState } from "@righton/networking";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import AnswerCard from "./AnswerCard";
import Theme from "../lib/Theme";

export default {
  title: "Design System/3_Organisms/AnswerCard",
  component: AnswerCard,
} as ComponentMeta<typeof AnswerCard>;

const Template: ComponentStory<typeof AnswerCard> = function AnswerCardTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <AnswerCard {...args} />
    </ThemeProvider>
  );
};

export const CorrectAnswer = Template.bind({});

CorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
  answers: [
    { text: "Answer 1", isCorrectAnswer: true },
    { text: "Answer 2", isCorrectAnswer: false },
    { text: "Answer 3", isCorrectAnswer: false },
    { text: "Answer 4", isCorrectAnswer: false },
  ],
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  answers: [
    { text: "Answer 1", isCorrectAnswer: true },
    { text: "Answer 2", isCorrectAnswer: false },
    { text: "Answer 3", isCorrectAnswer: false },
    { text: "Answer 4", isCorrectAnswer: false },
  ],
};