import React from "react";
import {
  IGameSession,
  GameSessionState,
  IAWSGameSession,
  GameSessionParser,
  IChoice,
} from "@righton/networking";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import PhaseResults from "./PhaseResults";
import MockGameSession from "../mock/MockGameSession.json";
import Theme from "../lib/Theme";

export default {
  title: "Design System/4_Pages/PhaseResults",
  component: PhaseResults,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PhaseResults>;

const Template: ComponentStory<typeof PhaseResults> =
  function PhaseResultsTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <PhaseResults {...args} />
      </ThemeProvider>
    );
  };

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as IAWSGameSession
) as IGameSession;

const answerChoices = gameSession.questions[0].choices!.map(
  // eslint-disable-line @typescript-eslint/no-non-null-assertion
  (choice: IChoice) => ({
    id: uuidv4(),
    text: choice.text,
    isCorrectAnswer: choice.isAnswer,
    reason: choice.reason ?? "",
  })
);

export const PhaseOne = Template.bind({});
PhaseOne.args = {
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_1_RESULTS,
  teamAvatar: 0,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: "2d609343-de50-4830-b65e-71eb72bb9bef",
  gameSession,
  answerChoices,
};

export const PhaseTwo = Template.bind({});
PhaseTwo.args = {
  teams: gameSession.teams,
  currentState: GameSessionState.PHASE_2_RESULTS,
  teamAvatar: 0,
  currentQuestionIndex: gameSession.currentQuestionIndex,
  teamId: "2d609343-de50-4830-b65e-71eb72bb9bef",
  gameSession,
  answerChoices,
};
