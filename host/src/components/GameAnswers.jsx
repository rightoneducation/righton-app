import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import Responses from "./Responses";
import { isNullOrUndefined } from "@righton/networking";

export default function GameAnswers({ questions, questionChoices, currentQuestionIndex, answersByQuestion, totalAnswers, numPlayers, currentState, statePosition}) {
  const letterDictionary = {
    0:'A. ',
    1:'B. ',
    2:'C. ',
    3:'D. ',
    4:'E. ',
    5:'F. ',
    6:'G. ',
    7:'H. ',
    8:'I. '
  }
  const classes = useStyles();
  let instructions = "";
  // returns the correct answer explanation for an individual question
  const getAnswerExplanation = (questions, currentQuestionIndex) => {
    if (isNullOrUndefined(questions) || questions.length <= currentQuestionIndex || isNullOrUndefined(questions[currentQuestionIndex].instructions)) {
      return null;
    }
    questions[currentQuestionIndex].instructions.map((step, index) => {
      instructions += "Step " + (index + 1) + ": " + step + "\n\n";
    });
    return instructions;
  };

  const answerExplanation = getAnswerExplanation(questions, currentQuestionIndex);

  const data = Object.keys(answersByQuestion).map((index) => ({
    count: answersByQuestion[index],
    label: letterDictionary[index].replace('. ', ''),
  }));


  return (
    <Grid className={classes.background}>
      <Responses
          studentResponses={data}
          numPlayers={numPlayers}
          totalAnswers={totalAnswers}
          currentState={currentState}
          questionChoices={questionChoices}
          statePosition={statePosition}
        />
      <Grid container className={classes.centerContent}>
        <Grid container>
          <Typography className={classes.titleStyle}>Answer Explainations</Typography>
        </Grid>
      </Grid>
      {(questionChoices) ?
        questionChoices.map((choice, index) => {
          return (<GameAnswersDropdown key={index} answer={choice.text} explanation={!choice.isAnswer ? choice.reason : answerExplanation} correct={choice.isAnswer} numQuestionAnswers={answersByQuestion[index]} totalAnswers={totalAnswers} pos={index} letterDictionary={letterDictionary} />)
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
  },
  titleStyle: {
    color: "var(--teacher-element-foreground, #FFF)",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    textTransform: "none",
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
    width: '95%',
    margin: 'auto',
    padding: "20px 40px",
  },
}));
