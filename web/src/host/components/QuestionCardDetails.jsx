import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import QuestionCard from "./QuestionCard";

export default function QuestionDetails({questions}) {
  const classes = useStyles();

  return (
    <Grid>
      <QuestionCard
        question={questions[0].text}
        hint={questions[0].instructions}
        image={questions[0].imageUrl}
      ></QuestionCard>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({}));
