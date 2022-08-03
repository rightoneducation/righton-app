import React, {useState} from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCardDetails from "../components/QuestionCardDetails";
import FooterGameInProgress from '../components/FooterGameInProgress';
import HeaderGameInProgress from '../components/HeaderGameInProgress';
import AnswersInProgressDetails from '../components/AnswersInProgressDetails';
import CheckMark from '../../images/Union.png'

export default function GameInProgress({ teams: { items: teams }, questions: { items: questions }, currentState, currentQuestionId, handleChangeGameStatus, phaseOneTime, phaseTwoTime }) {
    const classes = useStyles();
    const currentQuestion = questions[currentQuestionId - 1];
    const numAnswers = (teams) =>
    {
      let count = 0;
      teams.items.map(team => (team.teamMembers.items.map(teamMember => (teamMember.answers.items.map(answer => (answer.isChosen && count++))))));//.map(teamMember => (teamMember.answers.map((answer) => answer.isAnswered && count++)))))
      console.log("numAnswers" + count);
      return count;
    }

    console.log(currentState)

    return (
      <div className={classes.background}>
         <div style={{
                backgroundImage: `url(${CheckMark})`,
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: "10px",
                backgroundPositionY: "-300px"
            }}>
           <HeaderGameInProgress totalQuestions={questions.length} currentState={currentState} currentQuestion={currentQuestionId} phaseOneTime={phaseOneTime} phaseTwoTime={phaseTwoTime}/>
           <QuestionCardDetails title={currentQuestion} />
           <AnswersInProgressDetails/>
        </div>
        <FooterGameInProgress currentState={currentState} numPlayers={teams.length} numAnswers={numAnswers(teams)} handleChangeGameStatus={handleChangeGameStatus}/>
      </div>
    );
}

const useStyles = makeStyles(theme => ({
    background: {
        height: "100vh",
        width: "100%",
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
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