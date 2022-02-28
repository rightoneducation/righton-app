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
import GameMaker from './GameMaker';
import AddQuestionForm from './AddQuestionForm';
import { getGameById } from '../lib/games'

export default function Games({ loading, games, saveGame, saveQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType, addQuestion }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
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
            <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(id) => history.push(`/games/${id}`)}/>
          </Grid>
          
        </Grid>
      </Route>
      {match && getGameById(games, match.params.gameId) && (
        <Grid item xs={12} className={classes.content}>
          <Switch>
            <Route exact path="/games/:gameId/questions/:questionIndex" render={
              ({ match }) => {
                const { questionIndex, gameId } = match.params;
                const game = getGameById(games, gameId);
                return <QuestionDetails backUrl={`/games/${gameId}`} gameTitle={game.title} questionIndex={questionIndex} question={game.questions[questionIndex]} />
              }
            } />
            <Route exact path="/games/:gameId" render={
              ({ match }) => {
                const { gameId } = match.params;
                const game = getGameById(games, gameId)
                return <GameForm loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={game}  />;
              }
            } />
            <Route exact path="/games/:gameId/questions/:questionIndex/edit" render={
              ({ match }) => {
                const { questionIndex, gameId } = match.params;
                const game = getGameById(games, gameId);
                return <QuestionForm loading={loading} saveQuestion={saveQuestion} gameId={game.id} question={game.questions[questionIndex]} {...match.params} />;
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
      <Route exact path='/gamemaker/:gamemakerIndex' render={
        ({ match }) => {
          const { gamemakerIndex } = match.params;
          return <GameMaker game={games[Number(gamemakerIndex) - 1]} newSave={saveNewGame} editSave={saveGame} gamemakerIndex={gamemakerIndex}/>
        }
      } />;
      <Route path="/gamemaker/:gamemakerIndex/addquestion" render={
        ({ match }) => {
          const { gamemakerIndex } = match.params;
          return <AddQuestionForm loading={loading} games={games} deleteGame={deleteGame} cloneGame={cloneGame} addQuestion={addQuestion} saveQuestion={saveQuestion} gamemakerIndex={gamemakerIndex}/>;
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
