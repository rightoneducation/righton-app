import React from "react";
import { makeStyles } from "@material-ui/core";
import HeaderGame from "../components/HeaderGame";
import FooterGame from "../components/FooterGame";
import CheckMark from "../images/Union.png";
import { GameSessionState } from "@righton/networking";
import SVP1Results from '../images/SVP1Results.svg';
import SVP2Start from '../images/SVP2Start.svg';
import SVP2Results from '../images/SVP2Results.svg';

export default function StudentViews({
  questions,
  currentState,
  currentQuestionIndex,
  phaseOneTime,
  phaseTwoTime,
  gameTimer,
  handleUpdateGameSession
}) {
  
  let statePosition;
  let isLastQuestion = ((currentQuestionIndex+1) === (questions ? questions.length : 0));

  const classes = useStyles();  
  const stateArray = Object.values(GameSessionState); //adds all states from enum into array 
  const footerButtonTextDictionary=  { //dictionary used to assign button text based on the next state 
    
    //0-not started
    //1-teams joining
    //2-choose correct answer
    //3-phase_1_discuss
    //4-phase_1_results
    //5-phase_2_start
    //6-choose_trickiest_answer
    //7_phase_2_discuss
    //8-phase_2_results
    //9-final_results
    //10-finished

    //put this in gameinprogress

    2 : "End Answering",
    3 : "Go to Results",
    4 : "Go to Phase 2",
    5 : "Start Phase 2 Question",
    6 : "End Answering",
    7 : "Go to Results",
    8 : "Go to Next Question",
    9 : "Proceed to RightOn Central"
  };

  const studentViewImage = currentState => { //determines which student view image to show
    if (currentState === stateArray[4]){
      return SVP1Results;
    } else if (currentState === stateArray[8]){
      return SVP2Results;
    }
    else 
      return SVP2Start;
  };

  const nextStateFunc = currentState => { //determines next state for use by footer
    if (currentState === stateArray[8] && !isLastQuestion) {
      return stateArray[2];
    } else {
      return stateArray[stateArray.indexOf(currentState) + 1]; 
    }
  };

  let isLastGameScreen = ((currentQuestionIndex+1) === (questions ? questions.length : 0) && currentState === stateArray[8]); //if last screen of last question, head to view final results
  let nextState = nextStateFunc(currentState);

  const handleFooterOnClick = () => { //button needs to handle: 1. teacher answering early to pop modal 2.return to choose_correct_answer and add 1 to currentquestionindex 3. advance state to next state
    if (!isLastQuestion && statePosition === 8){ //if they are on the last page a\nd need to advance to the next question
      handleUpdateGameSession({currentState: GameSessionState[nextState], currentQuestionIndex: currentQuestionIndex+1}) 
    }
    else { 
      handleUpdateGameSession({currentState: GameSessionState[nextState]}) 
    }
  }

  return (
    <div className={classes.background}>      
        <div style={{height: "100%", width: "100%", display: "flex", minHeight: "100vh", flexDirection: "column", justifyContent: "space-between"}}>
          <HeaderGame
            totalQuestions={questions ? questions.length : 0}
            currentState={currentState}
            currentQuestion={currentQuestionIndex}
            phaseOneTime={phaseOneTime}
            phaseTwoTime={phaseTwoTime}
            statePosition = {statePosition = stateArray.indexOf(currentState)}
            />
            <div className={classes.studentViewsCont}>
              <div className = {classes.headText}> Current Student View: </div>
              <img src={studentViewImage(currentState)} alt="Student View" />
            </div>
            <FooterGame
              phaseOneTime={phaseOneTime}
              phaseTwoTime={phaseTwoTime}
              gameTimer={gameTimer} //flag studentview vs GameInProgress   
              footerButtonText={isLastGameScreen ? "View Final Results" : footerButtonTextDictionary[statePosition]} 
              handleUpdateGameSession={handleUpdateGameSession}
              handleFooterOnClick =  {handleFooterOnClick} //handler for button
            />
          </div>
       
    </div>

  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100%",
    width: "100%",
    minHeight: "100vh",
    background: `url(${CheckMark}) no-repeat 10px -300px, linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)`
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
  headText:{
    color: "white",
    fontWeight: "700", 
    fontFamily: "Poppins",
    size: "16px",
    lineHeight: "20px"
  },
  studentViewsCont:{
    display:"flex", 
    flexDirection:"column", 
    alignItems: "center",
    padding: "10%"
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
