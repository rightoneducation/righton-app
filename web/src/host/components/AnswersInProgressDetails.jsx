import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import HostAnswerDropdown from './AnswersInProgress';


export default function GameDetails() {
    const classes = useStyles();

    let correctAnswer = [
        {
            choice: "A: 120", explanation: "1. 360 is the sum of a circle"
        }
    ];

    let answerSet = [
        { choice: "B. 360", explanation: "1. 360 is the sum of a circle" },
        { choice: "C. 720", explanation: "1. 360 is the sum of a circle" },
        { choice: "D. 1080", explanation: "1. 360 is the sum of a circle" }
    ];

    return (
        <Grid className={classes.background}>


            <HostAnswerDropdown answer={correctAnswer[0].choice} explanation={correctAnswer[0].explanation} correct={true} />

            {answerSet.map((answer, index) => {
                return (
                    <HostAnswerDropdown key={index} answer={answer.choice} explanation={answer.explanation} correct={false} />
                );
            })}
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    background: {
        height: "100vh",
        width: "100%",
        background: 'linear-gradient(top,#0F78BD, #043373)',
        paddingTop: '25px'
    },
    answerTitle: {
        fontWeight: 500,
        color: 'white',
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '10px',
    }
}));
