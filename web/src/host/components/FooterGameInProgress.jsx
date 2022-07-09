import React from 'react';
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import PlayersAnsweredBar from './PlayersAnsweredBar';



export default function FooterGameInProgress({currentState, numPlayers, numAnswers }) {
  const classes = useStyles();
  
  const button = currentState => {
    if (currentState === "PHASE 1"){
      return ( <Button className={classes.startGameButton}> {"Skip to Results"} </Button>);
    } else if (currentState === "PHASE 2"){
      return ( <Button className={classes.startGameButton}> {"Skip to Next Question"} </Button>);
    } else {
      return ( <Button className={classes.nextPhaseButton}> {"Next Phase"} </Button>);
    }
  };


  return (
      <BottomNavigation className={classes.footer}>
        <div className={classes.footerContainer}>
          <div className={classes.playerNum}>Players who have answered</div>
          <PlayersAnsweredBar numPlayers={numPlayers} numAnswers={numAnswers}/>
          {button(currentState)}
        </div>
      </BottomNavigation>
  )
}

const useStyles = makeStyles(theme => ({
  footer:{
    position: 'sticky',
    bottom: '0',
    padding: '14%',
    background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    gap: '10px',
  },
  playerNum: {
    fontSize: '16px',
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Helvetica',
  },
  startGameButton: {
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    
  },
  nextPhaseButton: {
    border: '4px solid #159EFA',
    background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    boxShadow: '0px 5px 22px 0px #47D9FF4D',
  },
}));

