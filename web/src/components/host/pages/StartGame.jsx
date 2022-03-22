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
      <div className={classes.gameMode}>
        Basic Mode
      </div>
      <CurrentStudents/>
      
      <div classname={classes.startButtonDiv}>
        <div classname={classes.startButtonCenter}>
        <Button className={classes.startGameButton} variant="contained">Start Game</Button>
        </div>
      </div>
    </div>
  
    
  )
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    background: 'linear-gradient(right,#0F78BD,#043373)',
   
  },

  gameMode: {
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "Italic",
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.46)",
    paddingTop: "10%",
  },
  
  //trying to figure out how to position the start game button here, will circle back
  // startButtonDiv:{
  //   height: "200px",
  //   position: "relative"
  // },

  // startButtonCenter: {
  //   margin: "auto",
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%"
  // },

  startGameButton: {
    background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)',
    borderRadius: '34px',
    color: 'white',
    fontWeight: "bold",
    width: "300px",
    height: "48px",
    position: "absolute",
    bottom: "2%",
    marginLeft: "12%",
    
  }
}))