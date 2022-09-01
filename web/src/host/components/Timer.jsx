import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, IconButton } from "@material-ui/core";
import { AvTimer } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  blueButton: {
    marginLeft: "10px",
    marginTop: "10px",
    display: "inline",
    background: "linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "67.5px",
    textTransform: "none",
    fontSize: "17px",
    fontWeight: 500,
    color: "white",
    marginBottom: "20px",
    "&:disabled": {
      background: "rgba(255, 255, 255, 0.5)",
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  timerBar: {
    borderRadius: "40px",
    display: "inline-block",
    marginRight: "10px",
    width: "50%",
  },
  colorPrimary: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  barColorPrimary: {
    backgroundColor: "white",
  },
}));

export default function Timer({
  currentTime,
  totalRoundTime,
  setTime,
  pauseTime,
}) {
  const classes = useStyles();
  let countdown = useRef();

  useEffect(() => {
    countdown.current = setInterval(() => {
      if (!pauseTime && currentTime > 0) {
        setTime(currentTime - 1);
      }
    }, 1000);

    return () => clearInterval(countdown.current);
  }, [currentTime, pauseTime]);

  let percentage = () => {
    if (!pauseTime) {
      return currentTime / totalRoundTime;
    }
  };

  return (
    <div>
      <LinearProgress
        classes={{
          root: classes.timerBar,
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
        value={percentage() * 100}
        variant={"determinate"}
      />

      <p style={{ display: "inline-block", color: "white" }}>
        {Math.floor(currentTime / 60)}:
        {currentTime % 60 < 10 ? `0${currentTime % 60}` : `${currentTime % 60}`}
      </p>

      {/* <IconButton
        className={classes.blueButton}
        color="primary"
        type="button"
        variant="contained"
        disabled={time + 30 > timer || time === 0 ? true : false}
        onClick={() => setTime(time + 30)}
      >
        <AvTimer /> + 30 Sec.
      </IconButton> */}
    </div>
  );
}
