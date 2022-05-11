import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FooterGameInProgress from '../FooterGameInProgress';
import HostHeader from '../HostHeader';
import GameCard from '../GameCard';
import CurrentStudents from '../CurrentStudents';

export default function GameInProgress({sessionID}) { 
    const classes = useStyles();
    return (
        <div className={classes.root}>
               {/*<header component /> 
                  <QuestionCard component />
                  <AnswerChoices component />*/}
                  <HostHeader/>
      <GameCard/>
      <div className={classes.gameMode}>
        Basic Mode
      </div>
      <CurrentStudents/>

                  <FooterGameInProgress />
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
    },
}));