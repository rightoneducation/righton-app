import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import HostHeader from "../components/HostHeader";
import GameCard from "../components/GameCard";
import CurrentStudents from "../components/CurrentStudents";
import FooterStartGame from "../components/FooterStartGame";
import PlayerThinking from "../components/PlayerThinking";
import OpenAnswerCard from "../components/openanswercard/OpenAnswerCard";
import { parseAnswerToMistake, answerMatchAndSort, packageSubmittedAnswer } from "../lib/HelperFunctions";
import { removeStopwords, eng, fra } from 'stopword';

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
  const [sortedMistakes, setSortedMistakes] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [commonWords, setCommonWords] = useState([]);
  const [topWords, setTopWords] = useState([]);

  const findTopWords = (newAnswer) => {
    const words = newAnswer.rawInput.split(" ").filter((word) => word !== "");
    const strippedWords = removeStopwords(words);
    const existingWords = [...commonWords];
    const newWords = existingWords.concat(strippedWords);
    const frequency = newWords.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    const sortedByFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0,3);
    setCommonWords(newWords);
    return sortedByFrequency;
  };

  // this would actually be happening under the createTeamAnswer subscription
  const handleSubmitAnswer = (answer) => {
    // Location: Play - HandleSubmitAnswer
    const newMistake = packageSubmittedAnswer(answer);
    // CreateTeamAnswer(newAnswer);


    // Location: Host - From CreateTeamAnswer subscription
    const newSortedMistakes = answerMatchAndSort(newMistake, sortedMistakes);
    setTopWords(findTopWords(newMistake));
    setSortedMistakes(newSortedMistakes);
    setNewAnswer(answer);
  }
 
  return (
    <div className={classes.background}>
        <OpenAnswerCard answerObject={newAnswer} handleSubmitAnswer={handleSubmitAnswer}/>
        <PlayerThinking topWords={topWords} sortedMistakes={sortedMistakes} setSortedMistakes={setSortedMistakes}/>
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
