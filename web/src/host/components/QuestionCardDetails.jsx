import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import QuestionCard from "./QuestionCard";

export default function QuestionDetails({questions}) {
  const classes = useStyles();
  //pass current question in based off current index

  const currentQuestion = questions[0];

  return (
    <Grid>
      <QuestionCard
        question={currentQuestion.text}
        hint={currentQuestion.instructions}
        image={currentQuestion.imageUrl}
      ></QuestionCard>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({}));
