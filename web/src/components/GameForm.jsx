import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
  },
  addQuestion: {
    marginBottom: theme.spacing(2),
  },
  hr: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

function GameForm({ saveGame, game: originalGame, gameIndex }) {
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    document.title = 'RightOn! | Edit game';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);
  const [game, setGame] = useState(originalGame || {
    title: '',
  });
  const onChangeMaker = (field) => ({ currentTarget }) => { setGame({ ...game, [field]: currentTarget.value }); };
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    saveGame(game, gameIndex - 1);
    history.push('/');
  }, [game, gameIndex, history, saveGame]);

  const questions = [1, 2, 3, 4, 5].filter(index => !!game[`q${index}`]);

  return (
    <>
      {questions.length < 5 && (
        <Button className={classes.addQuestion} color="primary" type="button" variant="contained" onClick={() => history.push(`/games/${gameIndex}/questions/${questions.length + 1}`)}>
          Add question
        </Button>
      )}
      <form className={classes.root} noValidate autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        <Typography gutterBottom variant="h4" component="h1">
          {originalGame ? 'Edit' : 'New'} game
      </Typography>
        <TextField className={classes.input} id="game-title" value={game.title} onChange={onChangeMaker('title')} label="Title" variant="outlined" required />
        <TextField className={classes.input} id="game-description" value={game.description} onChange={onChangeMaker('description')} label="Description" variant="outlined" multiline rows={3} />

        {questions.map(index => {
          const { question, answer } = game[`q${index}`];
          return (
            <Paper className={classes.question}>
              <Typography gutterBottom>
                <strong>Q:</strong> {question}
              </Typography>
              <Typography>
                <strong>A:</strong> {answer}
              </Typography>
              <Button size="small" onClick={() => history.push(`/games/${gameIndex}/questions/${index}`)}>Edit</Button>
            </Paper>
          );
        })}

        <Divider className={classes.hr} />

        <Box>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} disabled={game === originalGame} className={classes.button}>
            Save
        </Button>
          <Button type="button" onClick={() => history.push('/')}>
            Cancel
        </Button>
        </Box>
      </form>
    </>
  );
}

export default GameForm;
