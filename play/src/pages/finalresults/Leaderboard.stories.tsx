import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import {
  IGameSession,
  IAWSGameSession,
  GameSessionParser,
} from "@righton/networking";
import MockGameSession from "../../mock/MockGameSession.json";
import Leaderboard from "./Leaderboard";
import Theme from "../../lib/Theme";

export default {
  title: "Design System/4_Pages/FinalResults_Leaderboard",
  component: Leaderboard,
} as ComponentMeta<typeof Leaderboard>;

const Template: ComponentStory<typeof Leaderboard> =
  function LeaderboardTemplate(args) {
    return (
      <ThemeProvider theme={Theme}>
        <Leaderboard {...args} />
      </ThemeProvider>
    );
  };

const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  MockGameSession as IAWSGameSession
) as IGameSession;

export const Default = Template.bind({});
Default.args = {
  teams: gameSession.teams,
  teamAvatar: 0,
  teamId: "2d609343-de50-4830-b65e-71eb72bb9bef",
};
