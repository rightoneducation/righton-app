import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import QuestionCard from "./QuestionCard";

export default function QuestionDetails(questions) {
  const classes = useStyles();
  const questionsDetails = questions.questions
  console.log(questionsDetails);

  return (
    <Grid>
      <QuestionCard
        question={questionsDetails[0].text}
        hint={questionsDetails[0].instructions}
        image={questionsDetails[0].imageUrl}
      ></QuestionCard>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({}));
