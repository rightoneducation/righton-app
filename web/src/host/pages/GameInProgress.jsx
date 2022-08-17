import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCardDetails from "../components/QuestionCardDetails";
import FooterGameInProgress from "../components/FooterGameInProgress";
import HeaderGameInProgress from "../components/HeaderGameInProgress";
import AnswersInProgressDetails from "../components/AnswersInProgressDetails";
import CheckMark from "../../images/Union.png";
import { ConstructionOutlined } from "@mui/icons-material";
import { GameSessionState } from "@righton/networking";

export default function GameInProgress({
  teams,
  questions,
  currentState,
  currentQuestionId,
  handleChangeGameStatus,
  phaseOneTime,
  phaseTwoTime,
  handleUpdateGameSessionStateFooter
}) {
const classes = useStyles();

  const stateArray = Object.values(GameSessionState); //adds all states from enum into array 
  let nextState;
 
  const numAnswersFunc = teams => { //finds all answers using isChosen, for use in footer progress bar
    let count = 0;
    teams && teams.map(team => 
       team.teamMembers && team.teamMembers.items.map(teamMember => 
        teamMember.answers && teamMember.answers.items.map(answer => answer.isChosen && count++
    )))

    return count;
  };

  const nextStateFunc = currentState => { //determines next state for use by footer
    if (currentState === "PHASE_2_RESULTS" && currentQuestionId === (questions ? questions.length : 0)){
      return "FINAL_RESULTS";
    } else if (currentState === "PHASE_2_RESULTS" && currentQuestionId !== (questions ? questions.length : 0)) {
      return "CHOOSE_CORRECT_ANSWER";
    } else {
    return stateArray[stateArray.indexOf(currentState) + 1]; 
    }
  };

  return (
    <div className={classes.background}>
      <div
        style={{
          backgroundImage: `url(${CheckMark})`,
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "10px",
          backgroundPositionY: "-300px"
        }}
      >
        <HeaderGameInProgress
          totalQuestions={questions ? questions.length : 0}
          currentState={currentState}
          currentQuestion={currentQuestionId}
          phaseOneTime={phaseOneTime}
          phaseTwoTime={phaseTwoTime}
        />
        <QuestionCardDetails questions={questions} />
        <AnswersInProgressDetails questions={questions} />
      </div>
    
      <FooterGameInProgress
        currentState={currentState}
        nextState = {nextState= nextStateFunc(currentState)} 
        nextQuestion = {(nextState === 'CHOOSE_CORRECT_ANSWER') ? currentQuestionId+1 : currentQuestionId} 
        numPlayers={teams ? teams.length : 0}
        numAnswers={numAnswersFunc(teams)}
        phaseOneTime={phaseOneTime}
        phaseTwoTime={phaseTwoTime}
        handleUpdateGameSessionStateFooter={handleUpdateGameSessionStateFooter}        
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100%",
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
