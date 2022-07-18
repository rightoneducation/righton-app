import React from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCardDetails from "../components/QuestionCardDetails";
import FooterGameInProgress from '../components/FooterGameInProgress';
import HeaderGameInProgress from '../components/HeaderGameInProgress';
import AnswersInProgressDetails from '../components/AnswersInProgressDetails';

export default function GameInProgress({ questions: { items: questions }, currentQuestionId, handleSkipToResults }) {
    const classes = useStyles();

    const currentQuestion = questions[currentQuestionId - 1];

    return (
        <div className={classes.background}>
            <HeaderGameInProgress/>
                <QuestionCardDetails title={currentQuestion} />
                <AnswersInProgressDetails/>
            <FooterGameInProgress handleSkipToResults={handleSkipToResults} />
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    background: {
        height: "100vh",
        width: "100%",
        background: 'linear-gradient(right,#0F78BD,#043373)',
    },
    number: {
        color: "white",
        height: "15px",
        width: "15px",
        borderStyle: "solid",
        borderColor: "white",
    },
    title: {
        color: "white",
    },
    timebar: {
        animationDuration: "5",
    },
    timebar1: {
        height: "5px",
    },
    indexcard: {
        display: "center",
        backgroundColor: "white",
        height: "30%",
        width: "80%",
    },
    button: {
        color: "#00A1FF",
        fontWeight: "bold",
        width: "90%",
        height: "45px",
        display: "center",
        background: "none",
        borderRadius: "24px",
        borderColor: "#00A1FF",
        borderStyle: "solid",
        borderWidth: "thick",
        textAlign: "center",
        marginLeft: "5%",
        marginRight: "5%",
    },
}))