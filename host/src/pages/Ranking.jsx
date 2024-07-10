import React from 'react';
import { makeStyles } from '@material-ui/core';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import HeaderRanking from '../components/HeaderRanking';
import FooterRanking from '../components/FooterRanking';
import CheckMark from '../images/Union.png';

export default function Ranking({
  teams,
  gameSessionId,
  currentState,
  handleUpdateGameSession,
}) {
  const classes = useStyles();
  const players = { teams }.teams;

  return (
    <div className={classes.background}>
      <div
        style={{
          backgroundImage: `url(${CheckMark})`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: '10px',
          backgroundPositionY: '-300px',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div
        id="bodycontainer"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          maxWidth: '700px'
        }}
      >
        <HeaderRanking />
        <div className={classes.contentContainer}>
          <Leaderboard teams={players} />
        </div>
        <FooterRanking
          gameSessionId={gameSessionId}
          currentState={currentState}
          handleUpdateGameSession={handleUpdateGameSession}
        />
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  },
  contentContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    border: 'none',
    overflowY: 'auto',
    maxWidth: '700px',
    touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
    '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
    padding: '24px',
    boxSizing: 'border-box',
  },
  scores: {
    overflow: 'scroll',
  },
}));