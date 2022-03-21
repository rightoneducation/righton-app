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
    background: 'linear-gradient(right,#0F78BD,#043373)',
   
  },
  
  startGameButton: {
    background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)',
    borderRadius: '22px',
    color: 'white',
    width: "233.28px",
    height: "39.45px",
    position: "fixed",
    bottom: "2%",
    marginLeft: "22%",
    
  }
}))