import React from 'react';
import { makeStyles, Theme } from "@material-ui/core";

export default function GameInProgress() {
  const classes = useStyles();

  return(
    <div className={classes.mainContainer} >
      <div className={classes.headerContainer}>
        <h1>Answer the Question</h1>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(247, 249, 250, 1)',
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    background: 'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
    height: '225px',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    position: 'relative',
  }
}));