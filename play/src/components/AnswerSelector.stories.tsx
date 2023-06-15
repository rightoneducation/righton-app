import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import AnswerSelector from "./AnswerSelector";
import { AnswerState } from "../lib/PlayModels";
import Theme from "../lib/Theme";

export default {
  title: "Design System/2_Molecules/AnswerSelector",
  component: AnswerSelector,
} as ComponentMeta<typeof AnswerSelector>;

const Template: ComponentStory<typeof AnswerSelector> =
  function AnswerSelectorTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <AnswerSelector {...args} />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {
  answerStatus: AnswerState.DEFAULT,
  isSubmitted: false,
  answerText: "Sample",
  index: 0,
};
