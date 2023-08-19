import React, { useState } from 'react';
import { Route, Routes, useNavigate, useMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import GameLaunch from './GameLaunch';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import GameMaker from './GameMaker';
import { getGameById } from '../lib/games';
import SearchBar from './SearchBar.jsx';

export default function Games({
  loading,
  games,
  saveGame,
  updateQuestion,
  deleteQuestion,
  saveNewGame,
  deleteGame,
  cloneGame,
  setSortType,
  cloneQuestion,
  isUserAuth,
  setSearchInput,
  searchInput,
  isSearchClick,
  handleSearchClick,
  isResolutionMobile,
}) {
  const classes = useStyles();
  const history = useNavigate();
  const handleSortChange = (value) => {
    setSortType(value);
  };
  const [sortByCheck, setSortByCheck] = React.useState(false);
  const [game, setGame] = useState(null);
  return (
    <Grid container className={classes.root} spacing={4}>
      <Routes>
        <Route
          exact="true"
          path="/games/:gameId/*"
          element={
            <Grid item xs={12} className={classes.content}>
              <Routes>
                <Route
                  exact="true"
                  path="/questions/:questionId"
                  element={
                    <QuestionDetails
                      // backUrl={`/games/${game.id}`}
                      // gameTitle={game.title}
                      // questionIndex={questionIndex}
                      // question={game.questions[questionIndex]}
                      game={game}
                    />
                  }
                />
                <Route
                  path="*"
                  element={
                    <GameLaunch
                      loading={loading}
                      saveGame={saveGame}
                      deleteQuestion={deleteQuestion}
                      deleteGame={deleteGame}
                      cloneGame={cloneGame}
                      isUserAuth={isUserAuth}
                      handleSearchClick={handleSearchClick}
                    />
                  }
                />
              </Routes>
            </Grid>
          }
        />
        <Route
          path="/gamemaker/:gameId/*"
          element={
            <GameMaker
              loading={loading}
              newSave={saveNewGame}
              editSave={saveGame}
              games={games}
              cloneQuestion={cloneQuestion}
              updateQuestion={updateQuestion}
              handleSearchClick={handleSearchClick}
            />
          }
        />

        <Route
          path="*"
          element={
            <Grid item xs={12} className={classes.sidebar}>
              <Box className={classes.actions}>
                <SearchBar
                  setSearchInput={setSearchInput}
                  searchInput={searchInput}
                  isSearchClick={isSearchClick}
                  handleSearchClick={handleSearchClick}
                  isResolutionMobile={isResolutionMobile}
                />
                <SortByDropdown
                  handleSortChange={handleSortChange}
                  sortByCheck={sortByCheck}
                  setSortByCheck={setSortByCheck}
                  isResolutionMobile={isResolutionMobile}
                />
              </Box>
              <Grid
                container
                onClick={() => {
                  setSortByCheck(false);
                }}
              >
                <GameDashboard
                  loading={loading}
                  games={games}
                  saveGame={saveGame}
                  deleteGame={deleteGame}
                  cloneGame={cloneGame}
                  onClickGame={(id) => {
                    const game = getGameById(games, id);
                    console.log('game', game);
                    setGame(game);
                    history(`/games/${id}`, { state: { game } });
                  }}
                  isUserAuth={isUserAuth}
                />
              </Grid>
            </Grid>
          }
        />
      </Routes>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
  },
  sidebar: {
    padding: `0px 0px ${theme.spacing(4)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 87px)',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  content: {
    minHeight: 'calc(100vh - 87px)',
    backgroundColor: '#F2F2F2',
  },
  actions: {
    paddingTop: '10px',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px 0px  !important`,
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    height: '40px',
  },
}));
