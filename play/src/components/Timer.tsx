import { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { LinearProgress, Theme} from "@mui/material";

interface TimerProps{
  totalTime: number;
  isPaused: boolean;
  isFinished: boolean;
  handleTimerIsFinished: () => void;
}

interface StyleProps {
  progress: number;
};

export default function Timer({
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished} : TimerProps
) {
  const [currentTimeMilli, setCurrentTimeMilli] = useState(totalTime * 1000); // millisecond updates to smooth out progress bar
  const currentTime = currentTimeMilli/1000;
  const progress = (currentTimeMilli/(totalTime*1000)) * 100;

  const classes = useStyles({progress: progress});
  
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  let originalTime: number;

  // recursive countdown timer function using requestAnimationFrame
  function updateTimer(timestamp: number) {
    if (prevTimeRef.current != null) {
      const delta = timestamp - prevTimeRef.current;
      setCurrentTimeMilli(prevTime => (prevTime - delta));
    }
    else 
      originalTime = timestamp; // this is the time taken for retreiving the first frame, need to add it to prevTimeRef for final comparison


    if (currentTimeMilli - (timestamp - originalTime) >=0) {
      prevTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(updateTimer);
    }
    else 
      handleTimerIsFinished();
  }

  // generates timer string (needs to ensure that seconds are always 2 digits and don't show as 60)
  function getTimerString(currentTime: number){
    let sec = 0;
    let secStr = '00';
    let min = 0;
    if (currentTime >= 0 ){
      min = Math.floor(currentTime / 60);
      sec = Math.ceil(currentTime % 60);
      if (sec === 60)
        sec = 0;
      secStr = sec < 10 ? `0${sec}` : `${sec}`;
    }
    return `${min}:${secStr}`;
  }

  // useEffect to start off timer 
  useEffect(() => {
    if (!isPaused && !isFinished)
      animationRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationRef.current!);
  }, []);

  return (
    <div className={classes.timerContainer}>
      <LinearProgress
        classes={{
          root: classes.timerBar,
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
        value={(currentTime/totalTime) * 100}
        variant={'determinate'}
      />
      <div className={classes.text}>
        {getTimerString(currentTime)}
      </div>
    </div>
  );
};


const useStyles = makeStyles((theme: Theme) => ({
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
    width: 'calc(100% - 25px)',
  },
  colorPrimary: {
    backgroundColor: 'rgba(255, 255, 255)',
  },
  barColorPrimary: (props: StyleProps) => ({
    background: `linear-gradient(90deg, #349E15 ${100 - props.progress}%, #7DC642 100%)`,
  }),
  text: {
    position: 'relative',
    right: 0,
    display: 'inline-block',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Karla',
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: '14px',
    width: '25px',
    textAlign: 'left',
  },
}));
