import React from "react";
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PlayersAnsweredBar from "./PlayersAnsweredBar";

export default function FooterGame({numPlayers, numAnswers, phaseOneTime, phaseTwoTime,  isGameInProgress, footerButtonText, handleFooterOnClick}) {
 const classes = useStyles();
   return (
    <BottomNavigation className={classes.footer}>
      <div className={classes.footerContainer}> {/*layout reversed below so hiding of bar doesn't blow up formatting*/}
      <Button 
          disabled = {phaseOneTime < 0 ? true : false || phaseTwoTime < 0 ? true : false}
          className={classes.nextPhaseButton}
          onClick={() =>  handleFooterOnClick()}
        >
           {footerButtonText}
        </Button>
        {isGameInProgress && <PlayersAnsweredBar numPlayers={numPlayers} numAnswers={numAnswers} />} {/*# of answers bar is turned on w/ GameInProgress */}
        {isGameInProgress && <div className={classes.playerNum}>Players who have answered</div>}
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
