import React from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core";
import HostHeader from '../HostHeader';
import GameCard from '../GameCard';
import CurrentStudents from '../CurrentStudents';




export const StartGame = () => {

const classes = useStyles()
  return (
    <div className={classes.background}>
     <HostHeader/>
      <GameCard/>
      <div>
        Basic Mode
      </div>
      <CurrentStudents/>
      <Button className={classes.startGameButton} variant="contained">Start Game</Button>
    </div>
  
    
  )
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    background: 'linear-gradient(right,#0F78BD,#043373)'
  },
  startGameButton: {
    background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)',
    boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.8)',
    borderRadius: '34px',
    color: 'white'
  }
}))