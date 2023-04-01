import { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

export default function Timer({
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished,
}) {
  const [currentTime, setCurrentTime] = useState(totalTime);
  const [currentTimeMilli, setCurrentTimeMilli] = useState(totalTime * 1000); // millisecond updates to smoother out progress bar
  const [testTime, setTestTime] = useState(0);
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(100);

  const classes = useStyles({progress});
  const animationRef = useRef(null);

  // // count 1 to 60 every second (60hz monitor) - this seems accurate enough
  // useEffect(() => {
  //   let lastTime;
  //   function updateTimer(timestamp) {
  //     if (lastTime != null) {
  //       let newCount = count+1;
  //       if (newCount > 60) {newCount = 0};
  //       setCount(newCount + 1);
  //       console.log(count);
  //     }
  //     lastTime = timestamp;
  //     animationRef.current = requestAnimationFrame(updateTimer);
  //   }
  //   animationRef.current = requestAnimationFrame(updateTimer);
  //   return () => cancelAnimationFrame(animationRef.current);
  // }, [count]);

  // // count 1 to 1000ms (1second) based on refresh rate of monitor - this isn't accurate 
  // useEffect(() => {
  //   let lastTime;
  //   function updateTimer(timestamp) {
  //     if (lastTime != null) {
  //       const delta = Math.trunc(timestamp - lastTime);
  //       let newCount = count + delta;
  //       if (newCount > 1000) {newCount = 0};
  //       setCount(newCount);
  //       console.log(newCount);
  //     }
  //     lastTime = timestamp;
  //     animationRef.current = requestAnimationFrame(updateTimer);
  //   }
  //   animationRef.current = requestAnimationFrame(updateTimer);
  //   return () => cancelAnimationFrame(animationRef.current);
  // }, [count]);

  // countdown from totalTime (15s) in ms for smooth linearProgress, also storing in seconds for text display - produces duplicated console logs on different animation grames
  useEffect(() => {
    let prevTime;
    function updateTimer(timestamp) {
      if (currentTimeMilli >= 0 && !isPaused && !isFinished) {
        if (prevTime != null) {
          const delta = timestamp - prevTime;
          const newTime = Math.trunc(currentTimeMilli - delta);
          setCurrentTimeMilli(newTime);
          setCurrentTime(Math.ceil(newTime / 1000));
          setProgress(((newTime/1000)/totalTime) * 100)
        }
        prevTime = timestamp;
        animationRef.current = requestAnimationFrame(updateTimer);
      }
      else 
      {
       handleTimerIsFinished();
      } 
    }
    animationRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationRef.current);
  }, [currentTimeMilli]);

  return (
    <div className={classes.timerContainer}>
      <LinearProgress
        classes={{
          root: classes.timerBar,
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
        value={progress}
        variant={'determinate'}
      />

      <div className={classes.text}>
        {Math.floor(currentTime / 60)}:
        {currentTime % 60 < 10 ? `0${currentTime % 60}` : `${currentTime % 60}`}
      </div>
    </div>
  );
};


const useStyles = makeStyles((theme) => ({
  timerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '24px',
    marginRight: '24px',
    marginTop: '8px',
    marginBottom: '8px',
    width: `calc(100% - 48px)`,
    maxWidth: '700px',
  },
  timerBar: {
    borderRadius: '40px',
    display: 'inline-block',
    marginRight: '10px',
    height: '8px',
    width: '100%'
  },
  colorPrimary: {
    backgroundColor: 'rgba(255, 255, 255)',
  },
  barColorPrimary: (props) => ({
    background: `linear-gradient(90deg, #349E15 ${100 - props.progress}%, #7DC642 100%)`,
  }),
  text: {
    display: 'inline-block',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Karla',
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: '14px',
  },
}));
