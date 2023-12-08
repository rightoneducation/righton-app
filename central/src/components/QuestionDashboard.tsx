import React from 'react';
import { makeStyles, Box } from '@material-ui/core';
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
  return (
    <Box className={classes.container}>
      {
        questions.map((question) => {
          return <QuestionCard  {...question} />
        })
      }
    </Box>
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
