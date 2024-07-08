import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, Divider } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
import AnswerDropdown from './AnswerDropdown';

export default function QuestionDetails({ gameTitle, question }) {
  const classes = useStyles();
  const history = useHistory();
  const choices = JSON.parse(question.choices);
  const answer = choices.find(({ isAnswer }) => isAnswer);
  const instructions = JSON.parse(question.instructions);
  let wrongAnswerSet = choices.filter(({ isAnswer }) => !isAnswer);

  if (wrongAnswerSet.length < 1) {
    wrongAnswerSet = [
      { text: "Wrong Answer Choice 1", reason: "N/A" },
      { text: "Wrong Answer Choice 2", reason: "N/A" },
      { text: "Wrong Answer Choice 3", reason: "N/A" },
    ];
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button type="button" onClick={() => history.goBack()}>
          <ArrowBackIcon className={classes.back} />Back to {gameTitle}
        </Button>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container xs={12} spacing={5}>
          <Grid item xs={12}>
            <Typography className={classes.title}>
              Question
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography className={classes.question} gutterBottom>
              {question.title}
            </Typography>
          </Grid>

          <Grid container item xs={12} alignItems='center' justifyContent='center'>
            {question.imageUrl ? <img className={classes.image} src={question.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" width={'60%'} />}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container xs={12} spacing={5}>
          <Grid item xs={12}>
            <Typography className={classes.answerTitle}>
              Answers
            </Typography>
          </Grid>

          <AnswerDropdown answer={answer?.text} instructions={instructions} explanation={answer?.reason} correct={true} />

          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          {wrongAnswerSet.map((wrongAnswer, index) => (
            <AnswerDropdown key={index} answer={wrongAnswer.text} explanation={wrongAnswer.reason} correct={false} />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  back: {
    marginRight: theme.spacing(1),
  },
  title: {
    fontWeight: 700,
    color: '#0075FF',
    textAlign: 'center',
    fontSize: '24px',
  },
  answerTitle: {
    fontWeight: 700,
    color: '#0075FF',
    textAlign: 'center',
    fontSize: '24px'
  },
  question: {
    fontWeight: 500,
    color: '#000000',
    textAlign: 'center',
    fontSize: '20px',
    marginLeft: '20px',
    marginRight: '20px',
  },
  image: {
    width: 'auto',
    maxWidth: '70%',
    height: 'auto',
    maxHeight: '90%',
  },
  square: {
    height: '450px',
    width: '450px',
    borderRadius: '10px',
  },
  divider: {
    height: '2px',
    backgroundColor: '#B5B5B5',
    marginBottom: '20px',
  },
}));