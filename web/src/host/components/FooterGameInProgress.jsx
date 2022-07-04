import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import PlayersAnsweredBar from './PlayersAnsweredBar';


export default function FooterStartGame({ handleSkipToResults }) {
  const classes = useStyles();
  // const history = useHistory();
  const sessionID = '12345';
  const [numPlayerJoin, setNumPlayerJoin] = useState(50);
  const [numPlayerTotal, setNumPlayerTotal] = useState(100);
  const [progressPercent, setProgressPercent] = useState(50);

  return (
      <BottomNavigation className={classes.footer}>
        <div className={classes.footerContainer}>
          <div className={classes.playerNum}>Players that answered</div>
          <PlayersAnsweredBar numPlayers={numPlayerTotal} numAnswers={numPlayerJoin} progressPercent={progressPercent} />
          <Button className={classes.startGameButton} onClick={handleSkipToResults}>Skip to Results</Button>
        </div>
      </BottomNavigation>
  )
}

const useStyles = makeStyles(theme => ({
  footer:{
    position: 'sticky',
    bottom: '0',
    padding: '7%',
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
}));

