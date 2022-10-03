import React from "react";
import { makeStyles, Grid, Box, BottomNavigation } from "@material-ui/core";
import { GameSessionState } from "@righton/networking";

const FooterRankings = ({ handleUpdateGameSession }) => {
  const classes = useStyles();

  return (
    <BottomNavigation className={classes.footer}>
      <div className={classes.footerContainer}>
        <hr className={classes.line} />
        <button className={classes.backButton} onClick={() =>
          handleUpdateGameSession({ currentState: GameSessionState.FINISHED })}>
          <p className={classes.backButtonText}>Exit to RightOn Central</p>
        </button>
      </div>
    </BottomNavigation >
  );
}

const useStyles = makeStyles(() => ({
  footer: {
    position: 'sticky',
    bottom: '0px',
    padding: '0px 40px 40px 40px',
    width: '100%',
    background: 'linear-gradient(top, #042c6c, #02215f)'
  },
  footerContainer: {
    width: '80%'
  },
  line: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    height: "1px",
    border: "none",
    marginBottom: "10px"
  },
  button: {
    display: "flex",
    justifyContent: "center"
  },
  backButton: {
    background: "linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)",
    width: "90%",
    borderRadius: "34px",
    border: "none",
    textAlign: "center",
    width: "100%",
    marginButton: "3%",
    marginBottom: "10px"
  },
  backButtonText: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "30px",
    color: "#FFFFFF",
    padding: "8px",
  }
}));

export default FooterRankings;