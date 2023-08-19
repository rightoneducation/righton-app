import React from 'react';
import { useNavigate, useMatch, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Link, Paper, Button, Box } from '@material-ui/core';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
import CCSS from './CCSS';
import { isNullOrUndefined } from '@righton/networking';

export default function AddQuestion({ games, submit, getGameById }) {
  const classes = useStyles();
  const history = useNavigate();

  const { gameId, selectedGameId, selectedQuestionId } = useParams();

  const game = getGameById(games, gameId);

  const parseQuestion = (question) =>
    JSON.parse(JSON.stringify(question).replace(/\'/g, '\u2019'));

  const handleAddQuestion = async (question) => {
    submit(question);
    history(`/gamemaker/${gameId}`);
  };

  let index;
  if (!isNullOrUndefined(selectedQuestionId)) {
    index = game?.questions.findIndex((q) => q.id === selectedQuestionId);
  } else {
    index = null;
  }

  const handleCloneQuestion = async (question) => {
    delete question.id;
    history(`/gamemaker/${gameId}/createquestion`, {
      ...parseQuestion(question),
    });
  };

  // Should be deleted as it is a temporary code for when a game has no questions, which wont exist in MVP
  const addQuestion = () =>
    history(`/games/${game.id}/questions/${questions.length + 1}/edit`);

  const questions = game?.questions || [];
  const questionCount = game?.questions?.length || 0;

  return (
    <Grid container item xs={12} className={classes.rightComponent}>
      <Grid item xs={12}>
        <h3 style={{ color: '#0075FF', textAlign: 'center' }}>
          Questions ({questionCount}){questionCount > 1 || questionCount === 0}
        </h3>
      </Grid>

      {questions.length === 0 && (
        <Typography
          className={classes.noQuestions}
          gutterBottom
          variant="h5"
          component="div"
        >
          No questions yet.{' '}
          <Link
            onClick={addQuestion}
            component="button"
            variant="h5"
            className={classes.addLink}
          >
            Add a question.
          </Link>
        </Typography>
      )}

      {questions.map((question, idx) => {
        if (isNullOrUndefined(question)) return null;

        const { text, answer, imageUrl } = question;
        return (
          <Grid key={question.id} item xs={12}>
            <Paper
              key={question.id}
              className={classes.question}
              onClick={() => {
                console.log(`selectedQuestion: ${question.id}`);
                history(`/gamemaker/${gameId}`, { state: { question } });
              }}
            >
              <Box>
                <CCSS
                  grade={question.grade}
                  domain={question.domain}
                  cluster={question.cluster}
                  standard={question.standard}
                />

                <Typography className={classes.questionIndex}>
                  Question {idx + 1}
                </Typography>

                <Typography>{text}</Typography>
              </Box>

              <Box className={classes.questionAnswer}>
                <Box>
                  {imageUrl ? (
                    <img className={classes.image} src={imageUrl} alt="" />
                  ) : (
                    <img
                      src={RightOnPlaceHolder}
                      alt="Placeholder"
                      width="70%"
                    />
                  )}

                  <Typography align="center">{answer}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        );
      })}

      <Grid container item className={classes.parent}>
        <Button
          className={classes.greenButton}
          variant="contained"
          onClick={() => handleAddQuestion(questions[index - 1])}
        >
          Add to Game
        </Button>

        <Button
          className={classes.blueButton}
          variant="contained"
          onClick={() => handleCloneQuestion(questions[index - 1])}
        >
          Clone and Edit
        </Button>

        <Button
          className={classes.redButton}
          variant="contained"
          onClick={() =>
            history(`/games/${game.id}/questions/${selectedQuestionId}`, {
              state: {
                game,
              },
            })
          }
        >
          View Question
        </Button>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    display: 'flex',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  question: {
    padding: theme.spacing(1.5),
    display: 'flex',
    marginRight: theme.spacing(2),
    width: '90%',
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      boxShadow: '1px 4px 12px grey',
      cursor: 'pointer',
    },
    height: '152px',
    boxShadow: '1px 4px 8px lightgrey',
    justifyContent: 'space-between',
  },
  addQuestion: {
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
  questionIndex: {
    minWidth: '32px',
    fontWeight: 'bold',
  },
  questionText: {
    paddingRight: theme.spacing(1),
    maxWidth: '100%',
    whiteSpace: 'pre-wrap',
  },
  questionAnswer: {
    display: 'flex',
    width: '148px',
  },
  image: {
    width: '100px',
  },
  moreButton: {
    minWidth: '32px',
    margin: '0 8px',
  },
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  rightComponent: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  parent: {
    position: 'sticky',
    alignSelf: 'end',
    justifyContent: 'space-evenly',
  },
  blueButton: {
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%);',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
  greenButton: {
    background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
  redButton: {
    background: 'linear-gradient(90deg, #E2215D 0%, #FC2164 100%)',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
}));
