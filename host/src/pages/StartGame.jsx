import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import HostHeader from "../components/HostHeader";
import GameCard from "../components/GameCard";
import CurrentStudents from "../components/CurrentStudents";
import FooterStartGame from "../components/FooterStartGame";
import FeaturedMistakes from "../components/FeaturedMistakes";
import OpenAnswerCard from "../components/openanswercard/OpenAnswerCard";

export default function StartGame({
  teams = [],
  questions,
  title = "",
  gameSessionId,
  gameCode,
  currentState,
  handleStartGame
}) {
  const classes = useStyles();
  const [sortedAnswers, setSortedAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const handleSubmitAnswer = (answer) => {
    setNewAnswer(answer);
  }
  return (
    <div className={classes.background}>
        <OpenAnswerCard answerObject={newAnswer} handleSubmitAnswer={handleSubmitAnswer}/>
        <FeaturedMistakes />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "row",
    justifyContent: "flex-start",
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
