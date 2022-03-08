import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import QuestionForm from './QuestionForm';
import GameForm from './GameForm';
import NewGameDialogue from './NewGameDialogue';
import EditGameDialogue from './EditGameDialogue';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import GameMaker from './GameMaker';
import AddQuestionForm from './AddQuestionForm';

export default function Games({ loading, games, saveGame, saveQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType, cloneQuestion }) {
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
          return <AddQuestionForm loading={loading} games={games} deleteGame={deleteGame} cloneGame={cloneGame} cloneQuestion={cloneQuestion} saveQuestion={saveQuestion} gamemakerIndex={gamemakerIndex}/>;
        }
      } />
      <Route exact path="/gamemaker/:gamemakerIndex/createquestion/:createQuestionIndex" render={
        ({ match }) => {
          const { gamemakerIndex, createQuestionIndex } = match.params;
          const gameNumber = Number(gamemakerIndex) - 1 == -1;
          return <QuestionForm loading={loading} question={gameNumber ? null : games[Number(gamemakerIndex) - 1].questions[Number(createQuestionIndex) - 1]} saveQuestion={saveQuestion} gamemakerIndex={gamemakerIndex} createQuestionIndex={createQuestionIndex}/>;
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
