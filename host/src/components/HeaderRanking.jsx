import React from 'react';
import { makeStyles } from '@material-ui/core';

export default function HeaderRanking() {
  const classes = useStyles();
  return (
    <div style={{
        top: 0,
        padding: '16px',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '700px',
    }}>
      <div className={classes.results}>
        <p>Final Results</p>
      </div>
      <div className={classes.leader}>
        <p>Leaderboard</p>
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  results: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '36px',
    lineHeight: '54px',
    color: '#FFFFFF',
  },
  leader: {
    marginBottom: '5%',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#FFFFFF',
  },
}));
