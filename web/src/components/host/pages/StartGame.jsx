import React from 'react'
import { makeStyles } from "@material-ui/core";
import HostHeader from '../HostHeader';
import GameCard from '../GameCard';
import CurrentStudents from '../CurrentStudents';
import FooterStartGame from '../FooterStartGame';

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
    height: "100%",
    width: "100%",
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