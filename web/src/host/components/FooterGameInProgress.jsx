import React from "react";
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PlayersAnsweredBar from "./PlayersAnsweredBar";
import { GameSessionState } from "@righton/networking";



export default function FooterGameInProgress({nextState, nextQuestion, numPlayers, numAnswers, phaseOneTime, phaseTwoTime, handleUpdateGameSessionStateFooter }) {
  const classes = useStyles();

  const currentStateToButtonText = { //dictionary used to assign button text based on the next state 
    "PHASE_1_RESULTS": "Skip to Results",
    "CHOOSE_TRICKIEST_ANSWER": "Next Phase",
    "PHASE_2_RESULTS": "Skip to Results",
    "CHOOSE_CORRECT_ANSWER": "Next Question",
    "FINAL_RESULTS": "View Final Results"
  }

   return (
    <BottomNavigation className={classes.footer}>
      <div className={classes.footerContainer}>
        <div className={classes.playerNum}>Players who have answered</div>
        <PlayersAnsweredBar numPlayers={numPlayers} numAnswers={numAnswers} />
        <Button
          disabled = {phaseOneTime < 0 ? true : false || phaseTwoTime < 0 ? true : false}
          className={classes.nextPhaseButton}
          onClick={() =>  handleUpdateGameSessionStateFooter(GameSessionState[nextState], nextQuestion, 30, 30)}
        >
          {currentStateToButtonText[nextState]}
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
