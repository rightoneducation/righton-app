import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, BottomNavigation, Paper } from "@material-ui/core";
import { GameSessionState } from "@righton/networking";

const FooterStartGame = ({ handleUpdateGameSession }) => {
  const classes = useStyles();
  return (
    <BottomNavigation className={classes.footer}>
      <button className={classes.startGameButton} onClick={() => 
        handleUpdateGameSession({currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, currentQuestionIndex: 0})}>
        Start Game
      </button>
      {/* <p className={classes.clickToPair}>
        Got a desktop and projector? Click here to pair it!
      </p> */}
    </BottomNavigation>
  );
};
const useStyles = makeStyles(theme => ({
  footer: {
    position: "sticky",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    bottom: "0",
    padding: "9.5%",
    background: "linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)"
  },
  clickToPair: {
    position: "absolute",
    fontSize: "12px",
    marginTop: "52px",
    marginBottom: "75px",
    textAlign: "center",
    fontWeight: "700",
    color: "rgba(0, 117, 255, 1)",
    textDecoration: "underline"
  },

  startGameButton: {
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
  }
}));

export default FooterStartGame;
