import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import QuestionCard from "./QuestionCard";

export default function QuestionDetails(questions) {
  const classes = useStyles();
  const questionsDetails = questions.questions
  console.log(questionsDetails);

  let question = [
    {
      explanation1:
        "In many countries, a stop sign is represented as a red eight-sided shape with the word 'STOP' in the middle",
      explanation2: "This eight-sided shape is known as an octagon",
      question: "How many degrees are in the interior angles of a stop sign?",
      hint: "hint1"
    }
  ];

  return (
    <Grid>
      <QuestionCard
        explanation1={questionsDetails[0].explanation1}
        explanation2={questionsDetails[0].explanation2}
        question={questionsDetails[0].text}
        hints={questionsDetails[0].answer}
      ></QuestionCard>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({}));
