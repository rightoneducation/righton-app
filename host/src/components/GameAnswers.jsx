import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import { isNullOrUndefined } from "@righton/networking";

export default function GameAnswers({ questions, currentQuestionIndex, answersByQuestion, totalAnswers}) {
  const classes = useStyles();
  
   // returns the choices object for an individual question
   const getQuestionChoices = (questions, currentQuestionIndex) => {
    if (isNullOrUndefined(questions) || questions.length <= currentQuestionIndex || isNullOrUndefined(questions[currentQuestionIndex].choices)) {
        return null;
    }
    return questions[currentQuestionIndex].choices;
  };

  // returns the correct answer explanation for an individual question
  const getAnswerExplanation = (questions, currentQuestionIndex) => {
    if (isNullOrUndefined(questions) || questions.length <= currentQuestionIndex || isNullOrUndefined(questions[currentQuestionIndex].instructions)) {
        return null;
    }
    return questions[currentQuestionIndex].instructions;
  };


  const questionChoices = getQuestionChoices(questions, currentQuestionIndex);
  const answerExplanation = getAnswerExplanation(questions, currentQuestionIndex);

  return (
    <Grid className={classes.background}>
     {(questionChoices) ? 
      questionChoices.map((choice,index) => {
        return (<GameAnswersDropdown key={index}  answer={choice.text} explanation={choice.isAnswer ? choice.reason : answerExplanation} correct={choice.isAnswer} numQuestionAnswers={answersByQuestion[index]} totalAnswers={totalAnswers} pos ={index}/>)
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
