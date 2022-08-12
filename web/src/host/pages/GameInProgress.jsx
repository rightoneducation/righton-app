import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCard from "../components/QuestionCard";
import FooterGameInProgress from '../components/FooterGameInProgress';
import GameDetails from "../components/AnswersInProgressDetails";

export default function GameInProgress({ questions: { items: questions }, currentQuestionId, handleSkipToResults }) {
    const classes = useStyles();

    return (
        <div>
            <GameDetails questions={questions}/>
        </div>
    );

}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)"
  },
  number: {
    color: "white",
    height: "15px",
    width: "15px",
    borderStyle: "solid",
    borderColor: "white"
  },
  title: {
    color: "white"
  },
  timebar: {
    animationDuration: "5"
  },
  timebar1: {
    height: "5px"
  },
  indexcard: {
    display: "center",
    backgroundColor: "white",
    height: "30%",
    width: "80%"
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
    marginRight: "5%"
  }
}));
