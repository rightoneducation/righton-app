import React, { useRef, useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

const TimerContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: `${theme.sizing.mediumPadding}px`,
  marginRight: `${theme.sizing.mediumPadding}px`,
  marginTop: `${theme.sizing.extraSmallPadding}px`,
  marginBottom: `${theme.sizing.extraSmallPadding}px`,
}));

const TimerBar = styled(LinearProgress)(({ theme }) => ({
  borderRadius: '40px',
  display: 'inline-block',
  marginRight: `${theme.sizing.extraSmallPadding}px`,
  height: `${theme.sizing.extraSmallPadding}px`,
  width: `calc(100% - ${theme.sizing.mediumPadding}px)`,
  backgroundColor: theme.palette.primary.main,
  '& .MuiLinearProgress-bar': {
    background: `linear-gradient(90deg, #349E15 0%, #7DC642 100%)`,
  },
}));

const TimerText = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: `${theme.sizing.extraSmallPadding}px`,
}));

interface TimerProps {
  totalTime: number;
  currentTimer: number;
  isPaused: boolean;
  isFinished: boolean;
  isAddTime?: boolean;
  handleTimerIsFinished: () => void;
}

export default function Timer({
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  isAddTime,
  handleTimerIsFinished,
}: TimerProps) {
  const [timerString, setTimerString] = useState<string>('00:00');
  const [progress, setProgress] = useState<number>(0);
  const currentTimeMilli = useRef<number>(currentTimer * 1000);
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const originalTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(isPaused);

  const getTimerString = (currentTimeInput: number) => {
    const currentTime = Math.trunc(currentTimeInput / 1000);
    let sec = 0;
    let secStr = '00';
    let min = 0;
    if (currentTime >= 0) {
      min = Math.floor(currentTime / 60);
      sec = Math.ceil(currentTime % 60);
      if (sec === 60) sec = 0;
      secStr = sec < 10 ? `0${sec}` : `${sec}`;
    }
    return `${min}:${secStr}`;
  };

  const updateTimer = (timestamp: number) => {
    if (!isPausedRef.current) {
      if (prevTimeRef.current != null) {
        const delta = timestamp - prevTimeRef.current;
        currentTimeMilli.current -= delta;
        setTimerString(getTimerString(currentTimeMilli.current));
        setProgress((currentTimeMilli.current / (totalTime * 1000)) * 100);
      } else {
        originalTimeRef.current = timestamp;
      }
      if (currentTimeMilli.current <= 0) {
        handleTimerIsFinished();
      } 
      else {
        prevTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(updateTimer);
      }
    }
  }

  useEffect(() => {
    currentTimeMilli.current = currentTimer * 1000; 
    if (currentTimer > 0) {
      isPausedRef.current = isPaused;
      if (!isPaused) {
        animationRef.current = requestAnimationFrame(updateTimer);
      }
    }
   return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [isPaused, isFinished, currentTimer, isAddTime]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer maxWidth="sm">
      <TimerBar 
        sx={{
          "& .MuiLinearProgress-bar": {
            transition: "none"
          }
        }} 
        value={progress} 
        variant="determinate" 
      />
      <TimerText maxWidth="sm">
        <Typography alignSelf="center" variant="caption">
          {timerString}
        </Typography>
      </TimerText>
    </TimerContainer>
  );
}