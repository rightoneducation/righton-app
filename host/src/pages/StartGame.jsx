import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import HostHeader from "../components/HostHeader";
import GameCard from "../components/GameCard";
import CurrentStudents from "../components/CurrentStudents";
import FooterStartGame from "../components/FooterStartGame";
import EnableConfidenceCard from "../components/EnableConfidenceCard";

export default function StartGame({
  teams = [],
  questions,
  title = "",
  gameSessionId,
  gameCode,
  currentState,
  handleStartGame,
  isConfidenceEnabled,
  handleConfidenceSwitchChange
}) {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.upperContainer}>
        <HostHeader gameCode={gameCode} currentState={currentState} />
        <GameCard questions={questions} title={title} />
        <EnableConfidenceCard 
         isConfidenceEnabled={isConfidenceEnabled} 
         handleConfidenceSwitchChange={handleConfidenceSwitchChange}
        />
        <div className={classes.gameMode}>Basic Mode</div>
        <CurrentStudents teams={teams} />
      </div>
      <FooterStartGame
        teamsLength={(teams ? teams.length : 0)}
        gameSessionId={gameSessionId}
        currentState={currentState}
        handleStartGame={handleStartGame}
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
  upperContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: '24px'
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
