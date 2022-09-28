import React, {useState} from "react";
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PlayersAnsweredBar from "./PlayersAnsweredBar";
import { GameSessionState } from "@righton/networking";



export default function FooterGame({nextState, currentQuestion, numPlayers, numAnswers, phaseOneTime, phaseTwoTime, handleUpdateGameSession, gameInProgress, endAnswer, handleModalOpenClose, statePosition, lastQuestion}) {
 const classes = useStyles();
  const nextStateToButtonText = { //dictionary used to assign button text based on the next state 
    
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
    
    2 : "End Answering",
    3 : "Go to Results",
    4 : "Go to Phase 2",
    5 : "Start Phase 2 Question",
    6 : "End Answering",
    7 : "Go to Results",
    8 : "Go to Next Question",
    9 : "Proceed to RightOn Central"
  }

  let [buttonText, setButtonText] = useState(nextStateToButtonText[statePosition]);
  const onClickFunc = () => { //button needs to handle: 1. teacher answering early to pop modal 2.return to choose_correct_answer and add 1 to currentquestionindex 3. advance state to next state
    if (endAnswer){ //if teacher is ending early, pop modal
      handleModalOpenClose(true);
    }
    else if (!lastQuestion && statePosition === 8){ //if they are on the last page and need to advance to the next question
      handleUpdateGameSession({currentState: GameSessionState[nextState], currentQuestionIndex: currentQuestion+1}) 
    }
    else { 
      handleUpdateGameSession({currentState: GameSessionState[nextState]}) 
    }
  }
console.log( nextState + " " + lastQuestion + " " + statePosition + " " + nextStateToButtonText[statePosition]);
   return (
    <BottomNavigation className={classes.footer}>
      <div className={classes.footerContainer}> {/*layout reversed below so hiding of bar doesn't blow up formatting*/}
      <Button 
          disabled = {phaseOneTime < 0 ? true : false || phaseTwoTime < 0 ? true : false}
          className={classes.nextPhaseButton}
          onClick={() =>  onClickFunc()}
        >
           {(lastQuestion && statePosition === 8)  ? "View Final Results" : nextStateToButtonText[statePosition] } {/*text changes based if last screen of last question*/}
        </Button>
        {gameInProgress && <PlayersAnsweredBar numPlayers={numPlayers} numAnswers={numAnswers} />} {/*# of answers bar is turned on w/ GameInProgress */}
        {gameInProgress && <div className={classes.playerNum}>Players who have answered</div>}
        </div>
    </BottomNavigation>
  );
}

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'sticky',
    bottom: '0',
    padding: '10.5%',
    background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
  },
  playerNum: {
    fontSize: '16px',
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '24px'
  },
  startGameButton: {
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
  },
  nextPhaseButton: {
    border: "4px solid #159EFA",
    background: "linear-gradient(#159EFA 100%,#19BCFB 100%)",
    borderRadius: "34px",
    width: "300px",
    height: "48px",
    color: "white",
    fontSize: "20px",
    bottom: '0',
    fontWeight: "700",
    lineHeight: "30px",
    boxShadow: "0px 5px 22px 0px #47D9FF4D", 
    "&:disabled": {
      background: 'transparent',
      border: '4px solid #159EFA',
      borderRadius: '34px',
      width: '300px',
      height: '48px',
      color: '#159EFA',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      opacity: '25%',
      cursor: "not-allowed",
    }
  }
}));
