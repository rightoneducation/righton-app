import React from "react";
import { makeStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function PlayersAnsweredBar({ numPlayers, numAnswers }) {
  const classes = useStyles();
  const progressPercent = (numPlayers !== 0 ? (numAnswers / numPlayers) * 100 : 0);

  return (
    <div className={classes.bargroup}>
      <div className={classes.barContainer}>
        <LinearProgress
          variant="determinate"
          classes={{
            colorPrimary: classes.colorPrimary,
            barColorPrimary: classes.barColorPrimary
          }}
          className={classes.progressBar}
          value={progressPercent}
        ></LinearProgress>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: `${progressPercent - 2}%`,
            textAlign: "right",
            fontFamily: "Helvetica",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: "1",
            lineHeight: "18px"
          }}
        >
          {" "}
          {numAnswers}{" "}
        </div>
      </div>
      <div className={classes.totalPlayers}>{numPlayers}</div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  bargroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: '10px',
    marginBottom: '20px'
  },
  totalPlayers: {
    fontSize: '12px',
    lineHeight: '18px',
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  barContainer: {
    position: 'relative',
    width: '291px',
  },
  progressBar: {
    position: 'relative',
    top: '0',
    left: '0',
    height: '18px',
    width: '100%',
    borderRadius: '3px',
  },
  colorPrimary: {
    background: 'rgba(255,255,255,0.2)',
  },
  barColorPrimary: {
    background: 'white',
  },
}));
