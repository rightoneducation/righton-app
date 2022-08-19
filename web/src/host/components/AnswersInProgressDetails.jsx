import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import HostAnswerDropdown from "./AnswersInProgress";

export default function GameDetails(questions) {
  const classes = useStyles();

  //currentQuestionId should be passed into GameDetails from GameInProgress 
  //which should be passed in from GameSession. Then there can be a filter 
  //function which returns a question object based on the current id. For now, 
  // currentQuestionId is hard coded.
  const question = questions.questions[0]

  const wrongAnswerArray = ((question.wrongAnswers).split('}')).map(wrongAnswer => wrongAnswer.split("\\\""))
  wrongAnswerArray.pop();
  let answerSet = wrongAnswerArray.map(array => ({ choice: array[3], explanation: array[7] }));

  let correctAnswer = [
    {
      choice: question.answer, explanation: "not available"
    }
  ];

  return (
    <Grid className={classes.background}>
      <HostAnswerDropdown answer={correctAnswer[0].choice} explanation={correctAnswer[0].explanation} correct={true} />
      {answerSet.map((answer, index) => {
        return (
          <HostAnswerDropdown key={index} answer={answer.choice} explanation={answer.explanation} correct={false} />
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
