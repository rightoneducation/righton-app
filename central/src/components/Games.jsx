import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import GameLaunch from './GameLaunch';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import GameMaker from './GameMaker';
import ErrorPage from './ErrorPage';
import { getGameById } from '../lib/games';


export default function Games({ loading, games, saveGame, updateQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType, cloneQuestion, isUserAuth, handleSearchClick }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };
  const [sortByCheck, setSortByCheck] = React.useState(false);

  return (
    <Grid container className={classes.root} spacing={4}>
      <Switch>
        <Route path="/" exact>
          <Grid item xs={12} className={classes.sidebar}>
            <Box className={classes.actions}>
              <SortByDropdown handleSortChange={handleSortChange} sortByCheck={sortByCheck} setSortByCheck={setSortByCheck} />
              <div style={{ width: '100vw', height: 45 }} onClick={() => setSortByCheck(false)}></div>
            </Box>
            <Grid container onClick={() => setSortByCheck(false)}>
              <GameDashboard loading={loading} games={games} saveGame={saveGame} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(id) => history.push(`/games/${id}`)} isUserAuth={isUserAuth}/>
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
                  handleSearchClick(false);
                  return <QuestionDetails backUrl={`/games/${gameId}`} gameTitle={game.title} questionIndex={questionIndex} question={game.questions[questionIndex]} />
                }
              } />
              <Route exact path="/games/:gameId" render={
                ({ match }) => {
                  const { gameId } = match.params;
                  const game = getGameById(games, gameId);
                  handleSearchClick(false);
                  return <GameLaunch loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={game} gameId={gameId} deleteGame={deleteGame} cloneGame={cloneGame} isUserAuth={isUserAuth}/>;
                }
              } />
            </Switch>
          </Grid>
        )}
        <Route path='/gamemaker/:gameId' render={
          isUserAuth && ( 
            ({ match }) => {
              const { gameId } = match.params;
              const newGame = Number(gameId) === 0;
              handleSearchClick(false);
              return <GameMaker loading={loading} game={newGame ? null : getGameById(games, gameId)} newSave={saveNewGame} editSave={saveGame} gameId={gameId} games={games} cloneQuestion={cloneQuestion} updateQuestion={updateQuestion}/>
            }
          )           
        } />
      </Switch>
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
    overflowX: 'hidden',
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
