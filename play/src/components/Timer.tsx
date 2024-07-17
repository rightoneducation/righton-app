import React, { useRef, useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { LocalModel, StorageKey } from '../lib/PlayModels';

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
  handleTimerIsFinished: () => void;
  localModel: LocalModel;
}

export default function Timer({
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  handleTimerIsFinished,
  localModel,
}: TimerProps) {
  console.log("currentTime in the beginning of timer");
  console.log(currentTimer);
  console.log(isFinished);
  const [currentTimeMilli, setCurrentTimeMilli] = useState(currentTimer * 1000); // millisecond updates to smooth out progress bar
  const currentTime = Math.trunc(currentTimeMilli / 1000);
  // const currentTime = currentTimer;
  console.log("currenttime but like just hte current time");
  console.log(currentTime);

  const progress = (currentTimeMilli / (totalTime * 1000)) * 100;

  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const originalTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(isPaused);

  // updates the current time as well as the localstorage in case of page reset
  // recursive countdown timer function using requestAnimationFrame
  function updateTimer(timestamp: number) {
    if (!isPausedRef.current) {
      if (prevTimeRef.current != null) {
        const delta = timestamp - prevTimeRef.current;
        setCurrentTimeMilli((prevTime) => prevTime - delta);
      } else {
        originalTimeRef.current = timestamp;
      }
      if (currentTimeMilli <= 0) {
        console.log("handleTimerisFiniished");
        handleTimerIsFinished();
      } else {
        prevTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(updateTimer);
      }
    }
  }

  const timerString = useMemo(() => {
    const getTimerString = (currentTimeInput: number) => {
      let sec = 0;
      let secStr = '00';
      let min = 0;
      if (currentTimeInput >= 0) {
        min = Math.floor(currentTimeInput / 60);
        sec = Math.ceil(currentTimeInput % 60);
        if (sec === 60) sec = 0;
        secStr = sec < 10 ? `0${sec}` : `${sec}`;
      }
      const storageObject: LocalModel = {
        ...localModel,
        currentTimer: currentTimeInput,
        hasRejoined: true,
      };
      window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
      return `${min}:${secStr}`;
    };
    return getTimerString(currentTime);
  }, [currentTime, localModel]);

  useEffect(() => {
    if (localModel.hasRejoined && localModel.currentTimer) {
      setCurrentTimeMilli(localModel.currentTimer * 1000);
    } else {
      setCurrentTimeMilli(currentTimer * 1000);
    }
    
  }, [localModel, currentTimer]);

  // useEffect to start off timer
  useEffect(() => {
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(updateTimer);
    }
    console.log("cancelAnimation");
    // ADDED THIS
   return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [isPaused, isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  // pdate the isPausedRef when the isPaused prop changes
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer maxWidth="sm">
      <TimerBar value={progress} variant="determinate" />
      <TimerText maxWidth="sm">
        <Typography alignSelf="center" variant="caption">
          {timerString}
        </Typography>
      </TimerText>
    </TimerContainer>
  );
}
