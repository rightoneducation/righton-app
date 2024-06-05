import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Box } from '@material-ui/core';
import LoadingIndicator from './LoadingIndicator';
import GameCard from './GameCard';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function GameDashboard({ checkGameOwner, loading, nextToken, publicPrivateQueryType, games, handleScrollDown, deleteGame, cloneGameTemplate, gameId, isUserAuth, setGameDetails }) {
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
    setActiveIndex(null);
  };
  const editHandler = async (game) => {
    try {
      const isOwner = await checkGameOwner(game);
      if (isOwner){
       setGameDetails(game);
       history.push(`/gamemaker/${game.id}`); 
        handleClose(); 
      } else {
        handleClose();
        alert('You do not have the required authorization to edit this game.');
      }
    }catch (error){
      console.log(error);
    }
  };

  const cloneHandler = async (game, event) => {
    try {
      const isOwner = await checkGameOwner(game);
      if (isOwner){
        cloneGameTemplate(game);
        handleClose(); 
      } else {
        handleClose();
        alert('You do not have the required authorization to clone this game.');
      }
    } catch (error){
      console.log(error);
    }
  };

  const deleteHandler = async (game) => {
    try {
      const isOwner = await checkGameOwner(game);
      if (isOwner){
        const confirmDelete = window.confirm('Are you sure you want to delete this game?');
        if (confirmDelete) {
          deleteGame(game.id);
        }
        handleClose();
      } else {
        handleClose();
        alert('You do not have the required authorization to delete this game.');
      }
    } catch (error) {
      console.log(error);
    }
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
      return <InfiniteScroll
          dataLength={games.length}
          next={() => handleScrollDown(nextToken)}
          hasMore={nextToken !== null}
          loader={<h4>Loading...</h4>}
          height={`calc(100vh - 156px)`}
          scrollableTarget="GameDashboard"
          className={classes.infiniteScroll}
        > 
        { (games.length >=1 ) ?
          games.map((game, index) => 
            <Grid key={index} container item xs={12} md={addquestion ? 12 : 6} lg={addquestion ? 12 : 4} style={{width: '100%'}}>
              <GameCard 
                key={game.id}
                game={game}
                index={index}
                handleClick={handleClick}
                handleClose={handleClose}
                editHandler={editHandler}
                cloneHandler={cloneHandler}
                deleteHandler={deleteHandler}
                addquestion={addquestion}
                match={match}
                isUserAuth={isUserAuth}
                anchorEl={anchorEl}
                activeIndex={activeIndex}
                onClick={() => history.push(`/games/${game.id}`)}
                publicPrivateQueryType={publicPrivateQueryType}
              />
            </Grid>
          ) : 
          <Typography> 
            No results found.
          </Typography>
        }
      </InfiniteScroll>
  }

  return (
      renderGames(loading)
  );
}

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    margin: 'auto',
    width: '60%',
    height: `calc(100vh - 156px)`
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
  },
  infiniteScroll : {
    display: 'flex', 
    justifyContent: 'flex-start', 
    width: '100%', 
    flexWrap: 'wrap', 
    overflowX: 'hidden', 
    overflowY: 'auto',
    zIndex: -2,
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
  }
}));
