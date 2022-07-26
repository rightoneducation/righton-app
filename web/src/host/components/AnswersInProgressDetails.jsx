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
    //map through questions then map through wrong answers
  return (
    
    questions.map((question, index) => {
        question.wrongAnswers.map((wrongAnswer, index) => {
                <HostAnswerDropdown
                    key={index}
                    wrongAnswer={wrongAnswer.wrong}
                    questionId={question.id}
                    isPhase2={isPhase2}
                />
             
        })
    })
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