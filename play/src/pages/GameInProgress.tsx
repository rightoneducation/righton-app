import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from "@mui/material";
import { IGameSession} from '@righton/networking';

interface GameInProgressProps {
  gameSession: IGameSession;
  placeholderStorybookProp: string;
}

export default function GameInProgress( {gameSession, placeholderStorybookProp}: GameInProgressProps) {
  const classes = useStyles();

  return(
    <div className={classes.mainContainer} >
      <Typography> {placeholderStorybookProp}  </Typography>
     <Typography> {JSON.stringify(gameSession)}  </Typography>
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
