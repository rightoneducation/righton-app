import React from "react";
import { Grid } from "@material-ui/core";
import QuestionCard from "./QuestionCard";

export default function QuestionDetails({questions}) {

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

