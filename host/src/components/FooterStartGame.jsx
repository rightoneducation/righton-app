import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, BottomNavigation, Paper } from "@material-ui/core";

const FooterStartGame = ({ handleStartGame, teamsLength, currentQuestionIndex }) => {
  const classes = useStyles();
  
  return (
    <BottomNavigation className={classes.footer}>
    <div>
      <Button
         disabled = {teamsLength <= 0 ? true: false} 
        className={classes.startGameButton} onClick={() => handleStartGame()}>
         Start Game
      </Button>
      </div>
    </BottomNavigation>
  );
};
const useStyles = makeStyles(theme => ({
  footer: {
    position: "sticky",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: "0",
    width: '100%',
    height: '80px',
    paddingTop: '80px',
    paddingBottom: '50px',
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
    textTransform: "none",
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

export default FooterStartGame;
