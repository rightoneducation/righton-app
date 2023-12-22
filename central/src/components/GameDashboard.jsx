import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Box } from '@material-ui/core';
import LoadingIndicator from './LoadingIndicator';
import GameCard from './GameCard';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function GameDashboard({ loading, nextToken, games, handleScrollDown, deleteGame, cloneGameTemplate, gameId, isUserAuth }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');
  const addquestion = useRouteMatch('/gamemaker/:gameId/addquestion');
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setActiveIndex(event.currentTarget.dataset.gameIndex);
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveIndex(null);
  };
  const cloneHandler = (game) => () => {
    cloneGameTemplate(game);
    handleClose();
  };
  const deleteHandler = (id) => () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this game?');
    if (confirmDelete) {
      deleteGame(id);
    }
    handleClose();
  };

  const renderGames = (loading) => {
    if (loading) return (
        <div className={classes.loadingContainer}>
          <div>
            <LoadingIndicator
              theme={[
                'rgb(126, 90, 175)',
                'rgb(148, 98, 179)',
                'rgb(169, 104, 180)',
                'rgb(186, 107, 177)',
                'rgb(202, 109, 172)',
                'rgb(218, 112, 168)',
                'rgb(237, 115, 166)',
                'rgb(255, 120, 165)',
              ]}
              radius={110}
              timerStartInSecond={1000}
              gameCreate={false}
            />
            <Typography className={classes.loadingTitle}>
              Loading Game List...
            </Typography>
            <Typography className={classes.loadingText}>
              If there are issues with loading, try reloading this page.
            </Typography>
          </div>
        </div>
    );

    if (games.length >= 1) {
      return <InfiniteScroll
          dataLength={games.length}
          next={() => handleScrollDown(nextToken)}
          hasMore={nextToken !== null}
          loader={<h4>Loading...</h4>}
          height={`calc(100vh - 156px)`}
          scrollableTarget="GameDashboard"
          style={{display: 'flex', justifyContent: 'flex-start', width: '100%', flexWrap: 'wrap', overflowY: 'scroll', zIndex: -2}}
        > 
          {games.map((game, index) => 
            <Grid key={index} container item xs={12} md={addquestion ? 12 : 6} lg={addquestion ? 12 : 4} style={{width: '100%'}}>
              <GameCard 
                key={game.id}
                game={game}
                index={index}
                handleClick={handleClick}
                handleClose={handleClose}
                cloneHandler={cloneHandler}
                deleteHandler={deleteHandler}
                addquestion={addquestion}
                match={match}
                isUserAuth={isUserAuth}
                anchorEl={anchorEl}
                activeIndex={activeIndex}
                onClick={() => history.push(`/games/${game.id}`)}
              />
            </Grid>
          )}
      </InfiniteScroll>
    }
    return (
      <Typography gutterBottom>
        No results found.
      </Typography>
    );
    
  }

  return (
      renderGames(loading)
  );
}

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    margin: 'auto',
    width: '60%',
  },
  loadingTitle: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '36px',
    letterSpacing: '0em',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px',
    letterSpacing: '0em',
    textAlign: 'center',
  }
}));
