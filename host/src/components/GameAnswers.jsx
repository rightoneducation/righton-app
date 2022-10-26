import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import { ChatBubbleOutlineSharp } from "@material-ui/icons";

export default function GameAnswers({ questionChoices, answersByQuestion, totalAnswers}) {
  const classes = useStyles();
 
  return (
    <Grid className={classes.background}>
     {(questionChoices) ? 
      questionChoices.map((choice,index) => {
        return (<GameAnswersDropdown key={index}  answer={choice.text} explanation={choice.reason ? choice.reason:""} correct={choice.isAnswer} numQuestionAnswers={answersByQuestion[index]} totalAnswers={totalAnswers} pos ={index}/>)
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
