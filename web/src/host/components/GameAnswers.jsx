import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import AnswerDropdown from "./AnswerDropdown";

export default function GameAnswers({ questions }) {
  const classes = useStyles();

  const question = questions[0]

 //const wrongAnswerArray = ((question.wrongAnswers)).map(answer => answer)

  /*let correctAnswer = [
    {
      choice: question.answer, explanation: "not available"
    }
  ];*/

  return (
    <Grid className={classes.background}>
       <GameAnswersDropdown answer={"Test"} explanation={"test"} correct={true} />
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
