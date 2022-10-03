import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import HostAnswerDropdown from "./AnswersInProgress";

export default function GameDetails({ questions }) {
  const classes = useStyles();

  const question = questions[0]

  const wrongAnswerArray = ((question.wrongAnswers)).map(answer => answer)

  let correctAnswer = [
    {
      choice: question.answer, explanation: "not available"
    }
  ];

  return (
    <Grid className={classes.background}>
      <HostAnswerDropdown answer={correctAnswer[0].choice} explanation={correctAnswer[0].explanation} correct={true} />
      {wrongAnswerArray.map((answer, index) => {
        return (
          <HostAnswerDropdown key={index} answer={answer.wrongAnswer} explanation={answer.reason} correct={false} />
        );
      })}
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
