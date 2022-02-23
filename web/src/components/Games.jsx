import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import QuestionForm from './QuestionForm';
import GameForm from './GameForm';
import NewGameDialogue from './NewGameDialogue';
import EditGameDialogue from './EditGameDialogue';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
// import { SORT_TYPES } from '../lib/sorting';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import AddQuestionForm from './AddQuestionForm';

export default function Games({ loading, games, saveGame, saveQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType, addQuestion }) {
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
      <Route path="/" exact>
        <Grid item xs={12} className={classes.sidebar}>
          <Box className={classes.actions}>
            <Button variant="contained" color="primary" onClick={() => setNewGameOpen(true)}>
              New game
            </Button>
            <SortByDropdown handleSortChange={handleSortChange} />
            <NewGameDialogue open={newGameOpen} onClose={() => setNewGameOpen(false)} submit={handleNewGame} />
          </Box>
          <Grid container>
            <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(index) => history.push(`/games/${index + 1}`)}/>
          </Grid>
          
        </Grid>
      </Route>
      {match && games[Number(match.params.gameIndex) - 1] && (
        <Grid item xs={12} className={classes.content}>
          <Switch>
            <Route path="/games/:gameIndex/questions/:questionIndex/copy" render={
              ({ match }) => {
                const { questionIndex, gameIndex } = match.params;
                return <AddQuestionForm gameIndex={gameIndex} questionIndex={questionIndex} loading={loading} games={games} deleteGame={deleteGame} cloneGame={cloneGame} saveQuestion={saveQuestion} gameId={games[Number(match.params.gameIndex) - 1].id} question={games[Number(gameIndex) - 1].questions[questionIndex]} {...match.params}/>;
              }
            } />
            <Route exact path="/games/:gameIndex/questions/:questionIndex" render={
              ({ match }) => {
                const { questionIndex, gameIndex } = match.params;
                return <QuestionDetails gameIndex={gameIndex} gameTitle={games[Number(gameIndex) - 1].title} questionIndex={questionIndex} question={games[Number(gameIndex) - 1].questions[questionIndex]} />
              }
            } />
            <Route exact path="/games/:gameIndex" render={
              ({ match }) => {
                const { gameIndex } = match.params;
                return <GameForm loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
              }
            } />
            <Route exact path="/games/:gameIndex/questions/:questionIndex/edit" render={
              ({ match }) => {
                const { questionIndex, gameIndex } = match.params;
                return <QuestionForm loading={loading} saveQuestion={saveQuestion} gameId={games[Number(match.params.gameIndex) - 1].id} question={games[Number(gameIndex) - 1].questions[questionIndex]} {...match.params} />;
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
      <Route path="/gamemaker/addquestion" render={
        ({ match }) => {
          return <AddQuestionForm loading={loading} games={games} deleteGame={deleteGame} cloneGame={cloneGame} addQuestion={addQuestion} saveQuestion={saveQuestion} {...match.params}/>;
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
    display: 'inline-flex',
  },
}));
