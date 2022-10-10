import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core";
import HostHeader from "../components/HostHeader";
import GameCard from "../components/GameCard";
import CurrentStudents from "../components/CurrentStudents";
import FooterStartGame from "../components/FooterStartGame";
import GameLoadModal from "../components/GameLoadModal";

export default function StartGame({
  teams = [],
  questions,
  title = "",
  gameSessionId,
  gameCode,
  currentState,
  handleStartGame,
  isTimerActive,
  isModalOpen,
  handleTimerFinished
}) {
  const classes = useStyles();
  const [countdown, setCountdown] = useState(3);
  

  useEffect(() => {
    let timer= null;
    if (isTimerActive){
        if (countdown > 0){
          timer = setInterval(() => {
               setCountdown(countdown - 1);
           }, 1000);
        }
        else
          handleTimerFinished();
    }
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div className={classes.background}>
      <GameLoadModal modalOpen={isModalOpen} countdown={countdown}/>
      <div>
        <HostHeader gameCode={gameCode} currentState={currentState} />
        <GameCard questions={questions} title={title} />
        <div className={classes.gameMode}>Basic Mode</div>
        <CurrentStudents teams={teams} />
      </div>
      <FooterStartGame
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

  gameMode: {
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "Italic",
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.46)",
    paddingTop: "10%"
  }
}));
