import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import HostAnswerDropdown from './AnswersInProgress';


export default function GameDetails({questions: {items: questions}, gameStatus}) {
    const classes = useStyles();
    let isPhase2 = false;

    if (gameStatus === "PHASE2") {
        isPhase2 = true;
    }

    var wrongAnswersInfo = questions[0].wrongAnswers;
    var listofWrongAnswers = [];
    for (let wrongAnswerNumber in wrongAnswersInfo) {
        let wrongAnswer = wrongAnswersInfo[wrongAnswerNumber].wrong
        listofWrongAnswers.push(wrongAnswer);
    }

    return (
        <Grid className={classes.background}>
            <Grid>
                <Typography className={classes.answerTitle}>Real-time Answers</Typography>
            </Grid>
            {listofWrongAnswers.map((wrongAnswer, index) => <HostAnswerDropdown key={index} correct={false} answer={wrongAnswer} phase2={isPhase2}/>)}
            <HostAnswerDropdown answer={questions[0].answer} correct={true} phase2={isPhase2}/>
        </Grid>    
    );

}

const useStyles = makeStyles(theme => ({
    background: {
        height: "100vh",
        width: "100%",
        background: 'linear-gradient(top,#0F78BD, #043373)',
    },
    answerTitle: {
        fontWeight: 500,
        color: 'white',
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '10px',
    }
}));