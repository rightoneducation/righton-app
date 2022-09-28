import React, {useState} from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCardDetails from "../components/QuestionCardDetails";
import FooterGame from "../components/FooterGame";
import HeaderGame from "../components/HeaderGame";
import AnswersInProgressDetails from "../components/AnswersInProgressDetails";
import CheckMark from "../../images/Union.png";
import { GameSessionState } from "@righton/networking";
import GameModal from "../components/GameModal";

export default function GameInProgress({
  teams,
  questions,
  currentState,
  currentQuestionIndex,
  phaseOneTime,
  phaseTwoTime,
  handleUpdateGameSession
}) {
  
  const classes = useStyles();

  const stateArray = Object.values(GameSessionState); //adds all states from enum into array 
  let nextState = stateArray[stateArray.indexOf(currentState) + 1];
  let [modalOpen, setModalOpen] = useState(false);
 
  const handleModalOpenClose = modalOpen =>{ //callback function for opening and closing the modal with onclicks
    setModalOpen(modalOpen);
  }

  const numAnswersFunc = teams => { //finds all answers using isChosen, for use in footer progress bar
    let count = 0;
    teams && teams.map(team => 
       team.teamMembers && team.teamMembers.items.map(teamMember => 
        teamMember.answers && teamMember.answers.items.map(answer => answer.isChosen && count++
    )))

    return count;
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
        <HeaderGame
          totalQuestions={questions ? questions.length : 0}
          currentState={currentState}
          currentQuestion={currentQuestionIndex}
          phaseOneTime={phaseOneTime}
          phaseTwoTime={phaseTwoTime}
        />
        <QuestionCardDetails questions={questions} />
      </div>
      <GameModal nextState={nextState} handleUpdateGameSession={handleUpdateGameSession} handleModalOpenClose={handleModalOpenClose} modalOpen={modalOpen} /> 
      <FooterGame
        nextState={nextState} //passing down nextState to handle the state update onClick
        numPlayers={teams ? teams.length : 0} //need # for answer bar
        numAnswers={12} //numAnswersFunc(teams)} //need # for answer bar
        phaseOneTime={phaseOneTime} 
        phaseTwoTime={phaseTwoTime}
        handleUpdateGameSession={handleUpdateGameSession} //onClick handler
        gameInProgress={true} //flag GameInProgress vs StudentView
        endAnswer ={ nextState === stateArray[3] || nextState === stateArray[7] ? true : false}  //determine if state matches screen where teacher might end before all students have answered
        handleModalOpenClose = {handleModalOpenClose} //handler to open/close modal
        statePosition={stateArray.indexOf(currentState)} //provides index of current state for use in footer dictionary
        lastQuestion={false} //this will only be true on StudentView
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
