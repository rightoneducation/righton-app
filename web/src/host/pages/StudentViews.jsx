import React from "react";
import { makeStyles } from "@material-ui/core";
import HeaderGame from "../components/HeaderGame";
import FooterGame from "../components/FooterGame";
import CheckMark from "../../images/Union.png";
import { GameSessionState } from "@righton/networking";
import SVP1Results from '../../images/SVP1Results.svg';
import SVP2Start from '../../images/SVP2Start.svg';
import SVP2Results from '../../images/SVP2Results.svg';

export default function StudentViews({
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
 
  const studentViewImage = currentState => { //determines which student view image to show
    if (currentState === "PHASE_1_RESULTS"){
      return SVP1Results;
    } else if (currentState === "PHASE_2_RESULTS"){
      return SVP2Results;
    }
    else 
      return SVP2Start;
  };

  const nextStateFunc = currentState => { //determines next state for use by footer
    if (currentState === "PHASE_2_RESULTS"){
      return "FINAL_RESULTS";
    } else if (currentState === "PHASE_2_RESULTS" && currentQuestionIndex !== (questions ? questions.length : 0)) {
      return "CHOOSE_CORRECT_ANSWER";
    } else {
    return stateArray[stateArray.indexOf(currentState) + 1]; 
    }
  };

  return (
    <div className={classes.background}>
      
        <div style={{height: "100%", width: "100%", display: "flex", minHeight: "100vh", flexDirection: "column", justifyContent: "space-between"}}>
          <HeaderGame
            totalQuestions={questions ? questions.length : 0}
            currentState={currentState}
            currentQuestion={currentQuestionIndex}
            phaseOneTime={phaseOneTime}
            phaseTwoTime={phaseTwoTime}
            gameInProgress={false}
            />

            <div className={classes.studentViewsCont}>
              <div className = {classes.headText}> Current Student View: </div>
              <img src={studentViewImage(currentState)} alt="Student View" />
            </div>
            

                <FooterGame
                  currentState={currentState}
                  nextState={nextState= nextStateFunc(currentState)} 
                  nextQuestion={currentQuestionIndex} 
                  phaseOneTime={phaseOneTime}
                  phaseTwoTime={phaseTwoTime}
                  handleUpdateGameSession={handleUpdateGameSession}
                  gameInProgress={false}        
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
