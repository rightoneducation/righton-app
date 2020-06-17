import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  input: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  question: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  addQuestion: {
    marginBottom: theme.spacing(2),
  },
  hr: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  addLink: {
    padding: 0,
    verticalAlign: 'top',
  },
  noQuestions: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  questionLeftContainer: {
    display: 'flex',
  },
  questionIndex: {
    minWidth: '32px',
  },
  questionText: {
    paddingRight: theme.spacing(2),
  },
  questionAnswer: {
    display: 'inline-block',
    width: '100px',
  },
  image: {
    width: '100px',
  }
}));

function GameForm({ loading, game, gameIndex }) {
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    document.title = 'RightOn! | Edit game';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);
  const addQuestion = () => history.push(`/games/${gameIndex}/questions/${questions.length + 1}`);

  if (loading) return <Skeleton variant="rect" height={500} />;

  const questions = [1, 2, 3, 4, 5].filter(index => !!game[`q${index}`]);

  return (
    <>
      {questions.length < 5 && (
        <Button className={classes.addQuestion} color="primary" type="button" variant="contained" onClick={addQuestion}>
          Add question
        </Button>
      )}
      <form className={classes.root} noValidate autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        {questions.length === 0 && (
          <Typography className={classes.noQuestions} gutterTop gutterBottom variant="h5" component="div">
            No questions yet. <Link onClick={addQuestion} component="button" variant="h5" className={classes.addLink}>Add a question.</Link>
          </Typography>
        )}
        {questions.map(index => {
          const { question, answer, image } = game[`q${index}`];
          return (
            <Paper className={classes.question}>
              <Box className={classes.questionLeftContainer}>
                <Box className={classes.questionIndex}>
                  <Typography variant="h5">
                    {index}.
                  </Typography>
                </Box>
                <Box className={classes.questionText}>
                  <Typography>
                    {question}
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.questionAnswer}>
                {image && <img className={classes.image} src={image} alt="" />}
                <Typography align="center">
                  {answer}
                </Typography>
                <Box>
                  <Button size="small" onClick={() => history.push(`/games/${gameIndex}/questions/${index}`)}>Edit</Button>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </form>
    </>
  );
}

export default GameForm;
