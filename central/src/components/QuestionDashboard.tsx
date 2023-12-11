import React from 'react';
import { makeStyles, Box, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { IQuestionTemplate } from '@righton/networking';
import QuestionCard from './QuestionCard';

type QuestionDashboardProps = {
  questions: IQuestionTemplate[];
};

export default function QuestionDashboard({
  questions
}: QuestionDashboardProps) {
  const classes = useStyles();
  console.log("sup");
  console.log(questions);
  return (
    <Grid container item xs={12} md={6} lg={4} className={classes.container}>
      {
        questions.map((question) => {
          return <QuestionCard  {...question} />
        })
      }
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'center',
   width: '100%',
   height: '100vh'
  }
}));
