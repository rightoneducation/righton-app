import React from "react";
import { makeStyles } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import PlayerScores from "../components/RankingsScores";
import HeaderRanking from "../components/HeaderRanking";
import FooterRanking from "../components/FooterRanking";

export default function Ranking({
  teams,
  gameSessionId,
  currentState,
  handleUpdateGameSessionState
}) {
  const classes = useStyles();
  const players = { teams }.teams;

  return (
    <div className={classes.background}>
      <div className={classes.content}>
        <HeaderRanking />
        <PlayerScores players={players} />
      </div>
      <FooterRanking
        gameSessionId={gameSessionId}
        currentState={currentState}
        handleUpdateGameSessionState={handleUpdateGameSessionState} />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(bottom,#02215F,#0D68B1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    overflowY: "scroll",
    overflowX: "hidden"
  },
  content: {
    width: "85%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "0px"
  },
  scores: {
    overflow: "scroll",
  }
}));
