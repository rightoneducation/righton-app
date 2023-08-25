import React from "react";
import { makeStyles } from '@material-ui/core';
import QuestionCard from "../components/QuestionCard";
import GameAnswers from "../components/GameAnswers";

export default function GameInProgressContentSwitch ({ 
    questions, 
    questionChoices, 
    currentQuestionIndex, 
    answersByQuestion, 
    totalAnswers, 
    numPlayers, 
    statePosition, 
    teamsPickedChoices, 
    data, 
    questionCardRef, 
    responsesRef, 
    gameAnswersRef,
    graphClickInfo,
    setGraphClickInfo,
    correctChoiceIndex
  }) {
  const classes = useStyles();
  return (
    <>
      <div id="questioncard-scrollbox" ref={questionCardRef}>
        <QuestionCard question={questions[currentQuestionIndex].text} image={questions[currentQuestionIndex].imageUrl} />
      </div>
      <div id="gameanswers-scrollbox" ref={gameAnswersRef}>
        <GameAnswers
          questions={questions}
          questionChoices={questionChoices}
          currentQuestionIndex={currentQuestionIndex}
          answersByQuestion={answersByQuestion}
          totalAnswers={totalAnswers}
          numPlayers={numPlayers}
          statePosition={statePosition}
          teamsPickedChoices = {teamsPickedChoices}
        />
      </div>
    </>
  );
};

const useStyles = makeStyles({
  answerContainer: {
    display: "flex",
    justifyContent: "center",
  },
});