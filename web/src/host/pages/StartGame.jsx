import React from 'react'
import { makeStyles } from "@material-ui/core";
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';

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
      <FooterStartGame/>
    </div>
  
    
  )
}

const useStyles = makeStyles(theme => ({
  background: {
    paddingBottom: "20px",
    background: 'linear-gradient(#0D68B1 0%, #02215F 100%)', 
  },

  gameMode: {
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "Italic",
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.46)",
    paddingTop: "10%",
  },
  
}))