import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import HostAnswerDropdown from './AnswersInProgress';


export default function GameDetails({questions: {items: questions}, wrongAnswers: {items: wrongAnswers}, gameStatus}) {
    const classes = useStyles();

    let isPhase2 = false;

    if (gameStatus === "PHASE2") {
        isPhase2 = true;
    }

    //map through questions then map through wrong answers
    const questionList = questions.items.map((question, index) => {
        const wrongAnswers = question.wrongAnswers.items.map((wrongAnswer, index) => {
            return (
                <HostAnswerDropdown
                    key={index}
                    wrongAnswer={wrongAnswer.wrongAnswer}
                    questionId={question.id}
                    isPhase2={isPhase2}
                />
            )
        }
        )
        return (
            <Grid key={index} item xs={12}>
                <Typography variant="h6">{question.question}</Typography>
                {wrongAnswers}
            </Grid>
        )
    })

    return (
        <Grid container spacing={3}>
            {questionList}
            </Grid>)
    
    // return (
    //     <Grid className={classes.background}>
    //         <Grid>
    //             <Typography className={classes.answerTitle}>Real-time Answers</Typography>
    //         </Grid>
    //         {questions &&
    //             questions.items.wrongAnswers.map((question, index) => {
    //             <HostAnswerDropdown key={index} answer={question.items.wrongAnswers.wrongAnswer} correct={false} phase2={isPhase2}/>
    //         })}
    //         <HostAnswerDropdown answer={questions.rightAnswer} correct={true} phase2={isPhase2}/>
    //     </Grid>    
    // );
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