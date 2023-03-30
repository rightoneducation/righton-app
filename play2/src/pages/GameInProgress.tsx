import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from "@mui/material";
import { IGameSession, GameSessionState } from '@righton/networking';

export default function GameInProgress(gameSession: IGameSession | null) {
  const classes = useStyles();

  return(
    <div className={classes.mainContainer} >
      <Typography variant="h1"> {gameSession?.currentState} </Typography>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgba(247, 249, 250, 1)',
  },
}));
