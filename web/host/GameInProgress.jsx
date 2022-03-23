import React from "react";
import { makeStyles } from "@material-ui/core";


const ProgressBar = (props) => {
    const {bgcolor, completed} = props;
    return (
        <div>
        </div>
    );
};

const questions = [
    {
        id: 1,
        question: "How many degreess are in the interior angles of a stop sign?",
        rightAnswer: "360",
        wrontAnswer1: "8",
        wrongAnswer2: "720",
        wrongAnswer3: "1080",
    },
    {
        id: 2,
        question: "question2",
        rightAnswer: "1",
        wrontAnswer1: "2",
        wrongAnswer2: "3",
        wrongAnswer3: "4",
    },
    {
        id: 3,
        question: "question3",
        rightAnswer: "1",
        wrontAnswer1: "2",
        wrongAnswer2: "3",
        wrongAnswer3: "4",
    },
]



export default function Ranking() {
    const classes = useStyles();

    
    
    return (
        // Ray been here
        <div className={classes.background}>
            <div>
                {questions.map((id,index) => (
                    <grid className={classes.number} key={id}>
                        {index+1}
                    </grid>
                ))}
            </div>
            <div className={classes.title}>
                <h1>Question 1 of 5</h1>
                <p>Phase 1 of 2</p>
            </div>
            <div className={classes.timebar}>
                <progress value={15} max={24} class={classes.timebar1} />
                <button>add time</button>
            </div>
            <div className={classes.indexcard}>

            </div>
            <div>
                {/* results and drop down bar goes here */}
            </div>
            Players that answered
            <div>
                <progress value={15} max={24}></progress>
            </div>
            <button className={classes.button}>
                Skip to Results
            </button>
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