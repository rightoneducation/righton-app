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
  let nextState;
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
 
  const nextStateFunc = currentState => { //determines next state for use by footer
    if (currentState === stateArray[7]){
      return stateArray[8];
    } else if (currentState === stateArray[7] && currentQuestionIndex !== (questions ? questions.length : 0)) {
      return stateArray[2];
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
        <HeaderGame
          totalQuestions={questions ? questions.length : 0}
          currentState={currentState}
          currentQuestion={currentQuestionIndex}
          phaseOneTime={phaseOneTime}
          phaseTwoTime={phaseTwoTime}
        />
        <QuestionCardDetails questions={questions} />
        <AnswersInProgressDetails questions={questions} />
      </div>
        <GameModal nextState={nextStateFunc(currentState)} handleUpdateGameSession={handleUpdateGameSession} handleModalOpenClose={handleModalOpenClose} modalOpen={modalOpen} /> 
      <FooterGame
        currentState={currentState}
        nextState={nextState= nextStateFunc(currentState)} 
        nextQuestion={currentQuestionIndex} 
        numPlayers={teams ? teams.length : 0}
        numAnswers={numAnswersFunc(teams)}
        phaseOneTime={phaseOneTime}
        phaseTwoTime={phaseTwoTime}
        handleUpdateGameSession={handleUpdateGameSession}
        endAnswer ={ nextStateFunc(currentState)=== stateArray[3]|| nextStateFunc(currentState)=== stateArray[7] ? true : false}   
        handleModalOpenClose = {handleModalOpenClose}
        statePosition={stateArray.indexOf(nextState)}
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
