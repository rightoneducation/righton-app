import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from "@mui/material";

interface GameInProgressProps {
  id: string;
  teamAvatar: number;
}

export default function GameInProgress( {id, teamAvatar}: GameInProgressProps) {
  const classes = useStyles();

  return(
    <div className={classes.mainContainer} >
    <Typography> {teamAvatar}  </Typography>
     <Typography> {id}  </Typography>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'column',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgba(247, 249, 250, 1)',
  },
}));
