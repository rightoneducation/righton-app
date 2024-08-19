import React, {useState, useMemo, useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  blueButton: {
    marginLeft: '10px',
    marginTop: '10px',
    display: 'inline',
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '67.5px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
    marginBottom: '20px',
    '&:disabled': {
      background: 'rgba(255, 255, 255, 0.5)',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  timerBar: {
    borderRadius: '40px',
    display: 'inline-block',
    marginRight: '10px',
    width: '50%',
    height: '6px',
  },
  colorPrimary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  barColorPrimary: {
    backgroundColor: 'white',
  },
}));

export default function Timer({ headerGameCurrentTime, isFinished, isPaused, totalRoundTime, handleTimerIsFinished }) {
  const classes = useStyles();
  const [currentTimeMilli, setCurrentTimeMilli] = useState(headerGameCurrentTime * 1000); // millisecond updates to smooth out progress bar
  const currentTime = Math.trunc(currentTimeMilli / 1000);
  const progress = (currentTimeMilli / (totalRoundTime * 1000)) * 100;
  const animationRef = useRef(null);
  const prevTimeRef = useRef(null);
  let originalTime;
  const isPausedRef = useRef(isPaused);
  // updates the current time as well as the localstorage in case of page reset
  // recursive countdown timer function using requestAnimationFrame
  function updateTimer(timestamp) {
    if (!isPausedRef.current) {
      if (prevTimeRef.current != null) {
        const delta = timestamp - prevTimeRef.current;
        setCurrentTimeMilli((prevTime) => prevTime - delta);
      } else originalTime = timestamp; // this is the time taken for retreiving the first frame, need to add it to prevTimeRef for final comparison
      if (currentTimeMilli - (timestamp - originalTime) >= 0) {
        prevTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(updateTimer);
      } else {
        handleTimerIsFinished();
      }
    }
  }

  const timerString = useMemo(() => {
    const getTimerString = (currentTimeInput) => {
      let sec = 0;
      let secStr = '00';
      let min = 0;
      if (currentTimeInput >= 0) {
        min = Math.floor(currentTimeInput / 60);
        sec = Math.ceil(currentTimeInput % 60);
        if (sec === 60) sec = 0;
        secStr = sec < 10 ? `0${sec}` : `${sec}`;
      }
      localStorage.setItem(
        'currentGameTimeStore',
        currentTimeInput
      );
      return `${min}:${secStr}`;
    };
    return getTimerString(currentTime);
  }, [currentTime]);

  // useEffect to start off timer
  useEffect(() => {
    if (!isPaused && !isFinished)
      animationRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [isPaused, isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the isPausedRef when the isPaused prop changes
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <LinearProgress
        classes={{
          root: classes.timerBar,
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
        value={progress}
        variant={'determinate'}
        style={{ width: 'calc(100% - 50px' }}
      />

      <p style={{ display: 'inline-block', color: 'white' }}>
        {timerString}
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
