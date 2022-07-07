import React, { useState, useEffect } from 'react';
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import PlayersAnsweredBar from './PlayersAnsweredBar';



export default function FooterStartGame({ teams, currentState, handleSkipToResults }) {
  const classes = useStyles();
  const [numPlayers, setNumPlayers] = useState(Object.keys(teams.items).length);
  const [buttonText, setButtonText] = useState("Skip to Results");
  const [buttonStyle, setButtonStyle] = useState(classes.startGameButton);
  const [numPlayersAnswered, setNumPlayersAnswered] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(()=> {
    if (currentState === "PHASE 1"){
      setButtonText("Skip to Results");
      setButtonStyle(classes.startGameButton);
    } else if (currentState === "PHASE 2"){
      setButtonText("Skip to Next Question");
      setButtonStyle(classes.startGameButton);
    } else {
      setButtonText("Next Phase");
      setButtonStyle(classes.nextPhaseButton);
    }
    let count = 0;
    Object.values(teams.items).forEach(item => {
      console.log(item);
      if (item.answered === "true"){
        count++;
      }
    });
    setNumPlayersAnswered(count);

    setProgressPercent((numPlayersAnswered/numPlayers)*100);
  });


  return (
      <BottomNavigation className={classes.footer}>
        <div className={classes.footerContainer}>
          <div className={classes.playerNum}>Players who have answered</div>
          <PlayersAnsweredBar numPlayers={numPlayers} numPlayersAnswered={numPlayersAnswered} progressPercent={progressPercent} />
          <Button className={buttonStyle} onClick={handleSkipToResults}> {buttonText} </Button>
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

