import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import GameLaunch from './GameLaunch';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import QuestionDashboard from './QuestionDashboard';
import GameMaker from './GameMaker';
import { getGameById } from '../lib/HelperFunctions';
import SearchBar from './SearchBar.jsx';


export default function Games({ loading, nextToken,  games, questions, saveGame, updateQuestion, deleteQuestion, handleScrollDown, saveNewGame, deleteGame, cloneGame, sortType, setSortType, cloneQuestion, isUserAuth, setSearchInput, searchInput, isSearchClick, handleSearchClick, isResolutionMobile, addQToGT, handleQuestionBankClick }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
  const handleSortChange = (value) => {
    setSortType(value);
  };
  const [sortByCheck, setSortByCheck] = React.useState(false);
  return (
    <Grid container className={classes.root} spacing={4}>
      <Switch>
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
                  return <GameLaunch loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={game} gameId={gameId} deleteGame={deleteGame} cloneGame={cloneGame} isUserAuth={isUserAuth} />;
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
              return <GameMaker loading={loading} questions={questions} game={newGame ? null : getGameById(games, gameId)} newSave={saveNewGame} editSave={saveGame} gameId={gameId} games={games} cloneQuestion={cloneQuestion} updateQuestion={updateQuestion} addQToGT={addQToGT} handleQuestionBankClick={handleQuestionBankClick} />;
            }
          )
        } />
          <Route path="/">
          <Grid item xs={12} className={classes.contentGrid}>
            <Box className={classes.actions}>
              <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} isSearchClick={isSearchClick} handleSearchClick={handleSearchClick} isResolutionMobile={isResolutionMobile} />
              <SortByDropdown handleSortChange={handleSortChange} sortByCheck={sortByCheck} setSortByCheck={setSortByCheck} isResolutionMobile={isResolutionMobile} style={{zIndex: 5}}/>
            </Box>
            <Grid container onClick={() => setSortByCheck(false)}>
              <Route exact path="/questions" render= { () => 
                <QuestionDashboard loading={loading} questions={questions}  />   
              }/>
              <Route exact path="/" render= { () => 
                <GameDashboard id="GameDashboard" nextToken={nextToken} loading={loading} games={games} handleScrollDown={handleScrollDown} saveGame={saveGame} deleteGame={deleteGame} cloneGame={cloneGame} isUserAuth={isUserAuth} />
              }/>
              </Grid>
          </Grid>
        </Route>
      </Switch>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
    zIndex: -2,
    overflowY: 'hidden',
    height: '100%',
  },
  contentGrid: {
    padding: `0px 0px 0px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    overflowY: 'hidden',
    overflowX: 'hidden',
    height: '100%'
  },
  content: {
    backgroundColor: '#F2F2F2',
  },
  actions: {
    paddingTop: '10px',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 10px 0px  !important`,
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    height: '40px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex:3
  },
}));
