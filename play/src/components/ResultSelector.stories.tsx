import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import { GameSessionState } from "@righton/networking";
import ResultSelector from "./ResultSelector";
import { AnswerState } from "../lib/PlayModels";
import Theme from "../lib/Theme";

export default {
  title: "Design System/2_Molecules/ResultSelector",
  component: ResultSelector,
} as ComponentMeta<typeof ResultSelector>;

const Template: ComponentStory<typeof ResultSelector> =
  function ResultSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <ResultSelector {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  answerStatus: AnswerState.DEFAULT,
  percentageText: "66%",
  answerText: "Sample",
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  index: 0,
};
