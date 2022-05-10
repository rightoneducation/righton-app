import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FooterGameInProgress from '../FooterGameInProgress';
import FooterStartGame from '../FooterStartGame.jsx';
import Button from '@material-ui/core/Button'; 

export default function GameInProgress({sessionID}) { 
    const classes = useStyles();
    return (
        <div className={classes.root}>
               {/*<header component /> 
                  <QuestionCard component />
                  <AnswerChoices component />*/}
                
                  <FooterStartGame className={classes.footer} />
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
    },
    footer: {
        position: 'absolute',
        top: '500px',
        padding: "7%", 
    },
}));