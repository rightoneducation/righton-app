import React from "react";
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PlayersAnsweredBar from "./PlayersAnsweredBar";
import { GameSessionState } from "@righton/networking";



export default function FooterGameInProgress({ currentState, nextState, numPlayers, numAnswers, phaseOneTime, phaseTwoTime, currentQuestion, totalQuestions,  handleUpdateGameSessionState }) {
  const classes = useStyles();

  const currentStateToButtonText = {
    "CHOOSE_CORRECT_ANSWER": "Next Phase",
    "PHASE_1_RESULTS": "Next Phase",
    "CHOOSING_TRICKIEST_ANSWER": "Next Question",
    "PHASE_2_RESULTS": "Next Questions",
  }

  const currentStateToClassName = {
    "CHOOSE_CORRECT_ANSWER": classes.startGameButton,
    "PHASE_1_RESULTS": classes.nextPhaseButton,
    "CHOOSING_TRICKIEST_ANSWER": classes.startGameButton,
    "PHASE_2_RESULTS": classes.startGameButton,
  }



  return (
    <BottomNavigation className={classes.footer}>
      <div className={classes.footerContainer}>
      {console.log(currentState + " "+ nextState)}
        <div className={classes.playerNum}>Players who have answered</div>
        <PlayersAnsweredBar numPlayers={numPlayers} numAnswers={numAnswers} />
        <Button
          className={currentStateToClassName[currentState]}
          onClick={() =>  handleUpdateGameSessionState(GameSessionState[nextState])}
        >
          {currentStateToButtonText[currentState]}
        </Button>
      </div>
    </BottomNavigation>
  );
}

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'sticky',
    bottom: '0',
    padding: '14%',
    background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    //gap: '10px',
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
    fontWeight: "700",
    lineHeight: "30px",
    boxShadow: "0px 5px 22px 0px #47D9FF4D",
  }
}));
