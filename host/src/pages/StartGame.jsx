import React from "react";
import { makeStyles } from "@material-ui/core";
import HostHeader from "../components/HostHeader";
import GameCard from "../components/GameCard";
import CurrentStudents from "../components/CurrentStudents";
import FooterStartGame from "../components/FooterStartGame";

export default function StartGame({
  teams = [],
  questions,
  title = "",
  gameSessionId,
  gameCode,
  currentState,
  handleUpdateGameSession
}) {
  const classes = useStyles();
  return (
    <div className={classes.background}>
      <div>
        <HostHeader gameCode={gameCode} currentState={currentState} />
        <GameCard questions={questions} title={title} />
        <div className={classes.gameMode}>Basic Mode</div>
        <CurrentStudents teams={teams} />
      </div>
      <FooterStartGame
        gameSessionId={gameSessionId}
        currentState={currentState}
        handleUpdateGameSession={handleUpdateGameSession}
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)"
  },

  gameMode: {
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "Italic",
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.46)",
    paddingTop: "10%"
  }
}));
