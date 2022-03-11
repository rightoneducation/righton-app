import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import GameForm from './GameForm';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import GameMaker from './GameMaker';
import { getGameById } from '../lib/games';
import AddQuestionForm from './AddQuestionForm';
// import QuestionForm from './QuestionForm';


export default function Games({ loading, games, saveGame, saveQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType, cloneQuestion }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  return (
    <Grid container className={classes.root} spacing={4}>
      <Route path="/" exact>
        <Grid item xs={12} className={classes.sidebar}>
          <Box className={classes.actions}>
            <SortByDropdown handleSortChange={handleSortChange} />
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
                return <GameForm loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={game} gameId={gameId}  />;
              }
            } />
          </Switch>
        </Grid>
      )}
      <Route path='/gamemaker/:gameId' render={
        ({ match }) => {
          const { gameId } = match.params;
          const newGame = Number(gameId) == 0;
          return <GameMaker loading={loading} game={newGame ? null : getGameById(games, gameId)} newSave={saveNewGame} editSave={saveGame} gameId={gameId} games={games} cloneQuestion={cloneQuestion} saveQuestion={saveQuestion}/>
        }
      } />;
      {/* <Route exact path="/gamemaker/:gameId/addquestion" render={
        ({ match }) => {
          const { gameId } = match.params;
          return <AddQuestionForm loading={loading} games={games} deleteGame={deleteGame} cloneGame={cloneGame} cloneQuestion={cloneQuestion} saveQuestion={saveQuestion} gameId={gameId}/>;
        }
      } /> */}
      {/* <Route exact path="/gamemaker/:gamemakerIndex/createquestion/:createQuestionIndex" render={
        ({ match }) => {
          const { gamemakerIndex, createQuestionIndex } = match.params;
          const gameNumber = Number(gamemakerIndex) - 1 == -1;
          return <QuestionForm loading={loading} question={gameNumber ? null : games[Number(gamemakerIndex) - 1].questions[Number(createQuestionIndex) - 1]} saveQuestion={saveQuestion} gamemakerIndex={gamemakerIndex} createQuestionIndex={createQuestionIndex}/>;
        }
      } /> */}
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
    padding: `0px 0px ${theme.spacing(4)}px ${theme.spacing(4)}px !important`,
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
