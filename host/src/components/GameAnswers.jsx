import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import { isNullOrUndefined } from "@righton/networking";

export default function GameAnswers({ questions, questionChoices, currentQuestionIndex, answersByQuestion, totalAnswers}) {
  const classes = useStyles();
  let instructions = "";
  // returns the correct answer explanation for an individual question
  const getAnswerExplanation = (questions, currentQuestionIndex) => {
    if (isNullOrUndefined(questions) || questions.length <= currentQuestionIndex || isNullOrUndefined(questions[currentQuestionIndex].instructions)) {
        return null;
    }
    questions[currentQuestionIndex].instructions.map((step, index) => {
    instructions += "Step " + (index+1) + ": " + step + "\n\n";
    });
    return instructions;
  };

  const answerExplanation = getAnswerExplanation(questions, currentQuestionIndex);

  return (
    <Grid className={classes.background}>
     {(questionChoices) ? 
      questionChoices.map((choice,index) => {
        return (<GameAnswersDropdown key={index}  answer={choice.text} explanation={!choice.isAnswer ? choice.reason : answerExplanation} correct={choice.isAnswer} numQuestionAnswers={answersByQuestion[index]} totalAnswers={totalAnswers} pos ={index}/>)
      })
      : null} 
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    //height: "100vh",
    width: "100%",
    background: 'transparent',
  },
  answerTitle: {
    fontWeight: 500,
    color: 'white',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '10px',
  }
}));
