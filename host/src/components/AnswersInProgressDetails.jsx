import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import HostAnswerDropdown from './AnswersInProgress';

export default function AnswersInProgressDetails({ questions }) {
  const classes = useStyles();

  const question = questions[0];
  const choices = JSON.parse(question.choices);

  return (
    <Grid className={classes.background}>
      {choices.map((answer, index) => (
        <HostAnswerDropdown
          key={index}
          answer={answer.text}
          explanation={answer.reason}
          correct={answer.isAnswer}
        />
      ))}
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    width: '100%',
    background: 'transparent',
  },
  answerTitle: {
    fontWeight: 500,
    color: 'white',
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '10px',
  },
}));
