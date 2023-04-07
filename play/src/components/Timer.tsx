import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';

const TimerContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: '24px',
  marginRight: '24px',
  marginTop: '8px',
  marginBottom: '8px',
});

const TimerBar = styled(LinearProgress)<LinearProgressProps>(
  ({theme}) => ({
  borderRadius: '40px',
    display: 'inline-block',
    marginRight: '10px',
    height: '8px',
    width: 'calc(100% - 25px)',
    backgroundColor: theme.palette.primary.main,
    '& .MuiLinearProgress-bar': {
      background: `linear-gradient(90deg, #349E15 0%, #7DC642 100%)`,
    }
}));

interface TimerProps {
  totalTime: number;
  isPaused: boolean;
  isFinished: boolean;
  handleTimerIsFinished: () => void;
}


export default function Timer({
  totalTime,
  isPaused,
  isFinished,
  handleTimerIsFinished
} : TimerProps ) {
  const [currentTimeMilli, setCurrentTimeMilli] = useState(totalTime * 1000); // millisecond updates to smooth out progress bar
  const currentTime = currentTimeMilli / 1000;
  const progress = (currentTimeMilli / (totalTime * 1000)) * 100;

  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  let originalTime: number;

  // recursive countdown timer function using requestAnimationFrame
  function updateTimer(timestamp: number) {
    if (prevTimeRef.current != null) {
      const delta = timestamp - prevTimeRef.current;
      setCurrentTimeMilli((prevTime) => prevTime - delta);
    } else originalTime = timestamp; // this is the time taken for retreiving the first frame, need to add it to prevTimeRef for final comparison

    if (currentTimeMilli - (timestamp - originalTime) >= 0) {
      prevTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(updateTimer);
    } else handleTimerIsFinished();
  }

  // generates timer string (needs to ensure that seconds are always 2 digits and don't show as 60)
  function getTimerString(currentTimeInput: number) {
    let sec = 0;
    let secStr = '00';
    let min = 0;
    if (currentTimeInput >= 0) {
      min = Math.floor(currentTimeInput / 60);
      sec = Math.ceil(currentTimeInput % 60);
      if (sec === 60) sec = 0;
      secStr = sec < 10 ? `0${sec}` : `${sec}`;
    }
    return `${min}:${secStr}`;
  }

  // useEffect to start off timer
  useEffect(() => {
    if (!isPaused && !isFinished)
      animationRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer maxWidth='sm'>
      <TimerBar
        value={progress}
        variant="determinate"
      />
      <Typography variant='caption'>{getTimerString(currentTime)}</Typography>
    </TimerContainer>
  );
}
