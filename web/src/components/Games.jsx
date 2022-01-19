import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { SORT_TYPES } from '../lib/sorting';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import QuestionForm from './QuestionForm';
import GameForm from './GameForm';
import NewGameDialogue from './NewGameDialogue';
import EditGameDialogue from './EditGameDialogue';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';

export default function Games({ loading, games, saveGame, saveQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');
  const [newGameOpen, setNewGameOpen] = useState(false);
  const handleNewGame = async (game) => {
    setNewGameOpen(false);
    await saveNewGame(game);
    history.push('/games/1');
  };
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  return (
    <Grid container className={classes.root} spacing={4}>
      <Grid item xs={match ? 3 : 12} className={classes.sidebar}>
        <Box className={classes.actions}>
          <Button variant="contained" color="primary" onClick={() => setNewGameOpen(true)}>
            New Game
          </Button>
          <SortByDropdown handleSortChange={handleSortChange} />
          <NewGameDialogue open={newGameOpen} onClose={() => setNewGameOpen(false)} submit={handleNewGame} />
        </Box>
        <Grid container>
          <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame}/>
        </Grid>
      </Grid>
      {match && games[Number(match.params.gameIndex) - 1] && (
        <Grid item xs={9} className={classes.content}>
          <Switch>
            <Route path="/games/:gameIndex/questions/:questionIndex" render={
              ({ match }) => {
                const { questionIndex, gameIndex } = match.params;
                return <QuestionForm loading={loading} saveQuestion={saveQuestion} gameId={games[Number(match.params.gameIndex) - 1].id} question={games[Number(gameIndex) - 1].questions[questionIndex]} {...match.params} />;
              }
            } />
            <Route path="/games/:gameIndex" render={
              ({ match }) => {
                const { gameIndex } = match.params;
                return <GameForm loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
              }
            } />
          </Switch>
        </Grid>
      )}
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
  sortSelect: {
    display: 'inline-block',
    padding: '6px',
    marginLeft: 15,
    backgroundColor: 'white',
    borderRadius: '18px',
    boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
    textAlign: 'center'
  },
}));
