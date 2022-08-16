import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, IconButton } from "@material-ui/core";
import { AvTimer } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
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
      cursor: "not-allowed"
    }
  },
  timerBar: {
    borderRadius: "40px",
    display: "inline-block",
    marginRight: "10px",
    width: "80%"
  },
  colorPrimary: {
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  },
  barColorPrimary: {
    backgroundColor: "white"
  }
}));

export default function Timer({ timer }) {
  const classes = useStyles();
  let countdown = useRef(); //useRef here
  //pass state of parent component as props for host instead of using state here
  //allowing other components access to timer
  const [time, setTime] = useState(timer);

  useEffect(() => {
    countdown.current = setInterval(() => {
      if (time > 0) {
        setTime(time - 1); //anytime the timer hits 0, unmount - clearInterval
      }
    }, 1000);

    return () => clearInterval(countdown.current);
  }, [time]);

  return (
    <div style={{marginLeft: "10px"}}>
      <LinearProgress
        classes={{
          root: classes.timerBar,
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary
        }}
        value={(time / timer) * 100}
        variant={"determinate"}
      />

      <p style={{ display: "inline-block", color: "white" }}>
        {Math.floor(time / 60)}:
        {time % 60 < 10 ? `0${time % 60}` : `${time % 60}`}
      </p>
      
      {/* Add 30 Seconds Button - Post MVP
      <IconButton
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
