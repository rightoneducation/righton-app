import React from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCard from "../components/QuestionCard";
import FooterGameInProgress from '../components/FooterGameInProgress';
import GameDetails from "../components/AnswersInProgressDetails";

const ProgressBar = (props) => {
    const { bgcolor, completed } = props;
    return (
        <div>

        </div>
    );
};




export default function GameInProgress({ questions: { items: questions }, currentQuestionId, handleSkipToResults }) {
    const classes = useStyles();

    const currentQuestion = questions[currentQuestionId - 1];

    return (
        <GameDetails/>
        // Ray been here
        // <div className={classes.background}>
        //     <div>
        //         {questions.map((question, index) => (
        //             <grid className={classes.number} key={question.id}>
        //                 {index + 1}
        //             </grid>
        //         ))}
        //     </div>
        //     <div className={classes.title}>
        //         <h1>Question {currentQuestionId} of {questions.length}</h1>
        //         <p>Phase 1 of 2</p>
        //     </div>
        //     <div className={classes.timebar}>
        //         <progress value={15} max={24} class={classes.timebar1} />
        //         <button>add time</button>
        //     </div>
        //     <QuestionCard title={currentQuestion.question} />
        //     <div>
        //         {/* results and drop down bar goes here */}
        //     </div>
        //     <FooterGameInProgress handleSkipToResults={handleSkipToResults} />
        // </div>
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