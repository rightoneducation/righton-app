import React, { useState } from 'react';
import classnames from 'classnames';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import QuestionForm from './QuestionForm';
import GameForm from './GameForm';
import NewGameDialogue from './NewGameDialogue';
import EditGameDialogue from './EditGameDialogue';

export default function Games({ loading, games, saveGame, saveQuestion, saveNewGame, searchInput, setSearchInput }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');
  const [newGameOpen, setNewGameOpen] = useState(false);
  const handleNewGame = async (game) => {
    setNewGameOpen(false);
    await saveNewGame(game);
    history.push('/games/1');
  };

  if (games.length < 1) return null;

  return (
    <Grid container className={classes.root} spacing={4}>
      <Grid item xs={3} className={classes.sidebar}>
        <Box className={classes.actions}>
          <Button variant="contained" color="primary" onClick={() => setNewGameOpen(true)} disabled={!!match}>
            Add game
          </Button>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search games…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={searchInput}
              onChange={({ target }) => setSearchInput(target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <NewGameDialogue open={newGameOpen} onClose={() => setNewGameOpen(false)} submit={handleNewGame} />
        </Box>
        {games
          .map(({ GameID, title, grade, q1, q2, q3, q4, q5 }, index) => {
            const questionCount = [q1, q2, q3, q4, q5].filter(q => !!q).length;
            return (
              <Card className={classnames(classes.game, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={GameID} onClick={() => history.push(`/games/${index + 1}`)}>
                <CardContent>
                  <Typography gutterBottom>
                    {title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : ''}{grade && ` — Grade ${grade}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={(event) => { history.push(`/games/${index + 1}/edit`); event.stopPropagation(); }}>Edit</Button>
                </CardActions>
              </Card>
            );
          })}
      </Grid>
      <Grid item xs={9} className={classes.content}>
        <Switch>
          <Route path="/games/:gameIndex/questions/:questionIndex" render={
            ({ match }) => {
              const { questionIndex, gameIndex } = match.params;
              return <QuestionForm loading={loading} saveQuestion={saveQuestion} question={games[Number(gameIndex) - 1][`q${Number(questionIndex)}`]} {...match.params} />;
            }
          } />
          <Route path="/games/:gameIndex" render={
            ({ match }) => {
              const { gameIndex } = match.params;
              return <GameForm loading={loading} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
            }
          } />
        </Switch>
      </Grid>
      <Route path="/games/:gameIndex/edit" render={
        ({ match }) => {
          const { gameIndex } = match.params;
          return <EditGameDialogue open game={games[Number(gameIndex) - 1]} onClose={() => history.push(`/games/${gameIndex}`)} submit={saveGame} />;
        }
      } />
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
  },
  game: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
    }
  },
  gameSelected: {
    backgroundColor: '#CAF0F3',
    '&:hover': {
      backgroundColor: '#CAF0F3',
      cursor: 'default',
    }
  },
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  content: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#F2F2F2',
  },
  actions: {
    marginBottom: '16px',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    display: 'inline-block',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
    },
  },
}));
