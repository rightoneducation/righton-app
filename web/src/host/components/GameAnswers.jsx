import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import AnswerDropdown from "./AnswerDropdown";
import { ChatBubbleOutlineSharp } from "@material-ui/icons";

export default function GameAnswers({ questionChoices }) {
  const classes = useStyles();

  return (
    <Grid className={classes.background}>
    {questionChoices.map(choice => {
      return (<GameAnswersDropdown answer={choice.text} explanation={choice.reason ? choice.reason:""} correct={choice.isAnswer} />)
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
