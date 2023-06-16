import React, { useRef, useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { LocalModel, StorageKey } from '../lib/PlayModels';
import { fetchLocalData } from '../lib/HelperFunctions';

const TimerContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginLeft: `${theme.sizing.mediumPadding}px`,
  marginRight: `${theme.sizing.mediumPadding}px`,
  marginTop: `${theme.sizing.extraSmallPadding}px`,
  marginBottom: `${theme.sizing.extraSmallPadding}px`,
}));

const TimerBar = styled(LinearProgress)(({ theme }) => ({
  borderRadius: "40px",
  display: "inline-block",
  marginRight: `${theme.sizing.extraSmallPadding}px`,
  height: `${theme.sizing.extraSmallPadding}px`,
  width: `calc(100% - ${theme.sizing.mediumPadding}px)`,
  backgroundColor: theme.palette.primary.main,
  "& .MuiLinearProgress-bar": {
    background: `linear-gradient(90deg, #349E15 0%, #7DC642 100%)`,
  },
}));

interface TimerProps {
  totalTime: number;
  currentTimer: number;
  isPaused: boolean;
  isFinished: boolean;
  handleTimerIsFinished: () => void;
}

export default function Timer({
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  handleTimerIsFinished,
}: TimerProps) {
  const [currentTimeMilli, setCurrentTimeMilli] = useState(currentTimer * 1000); // millisecond updates to smooth out progress bar
  const currentTime = Math.trunc(currentTimeMilli / 1000);
  const progress = (currentTimeMilli / (totalTime * 1000)) * 100;

  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  let originalTime: number;
  const isPausedRef = useRef<boolean>(isPaused);

  // retreive local storage data so that timer has correct value on rejoin
  const rejoinGameObject = fetchLocalData();
  // updates the current time as well as the localstorage in case of page reset
  // recursive countdown timer function using requestAnimationFrame
  function updateTimer(timestamp: number) {
    if (!isPausedRef.current) {
      if (prevTimeRef.current != null) {
        const delta = timestamp - prevTimeRef.current;
        setCurrentTimeMilli((prevTime) => prevTime - delta);
      } else originalTime = timestamp; // this is the time taken for retreiving the first frame, need to add it to prevTimeRef for final comparison

      if (currentTimeMilli - (timestamp - originalTime) >= 0) {
        prevTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(updateTimer);
      } else handleTimerIsFinished();
    }
  }

  const timerString = useMemo(() => {
    const getTimerString = (currentTimeInput: number) => {
      let sec = 0;
      let secStr = "00";
      let min = 0;
      if (currentTimeInput >= 0) {
        min = Math.floor(currentTimeInput / 60);
        sec = Math.ceil(currentTimeInput % 60);
        if (sec === 60) sec = 0;
        secStr = sec < 10 ? `0${sec}` : `${sec}`;
      }
      const storageObject: LocalModel = {
        ...rejoinGameObject,
        currentTimer: currentTimeInput,
      };
      window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
      return `${min}:${secStr}`;
    };
    return getTimerString(currentTime);
  }, [currentTime, rejoinGameObject]);

  // useEffect to start off timer
  useEffect(() => {
    if (!isPaused && !isFinished)
      animationRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the isPausedRef when the isPaused prop changes
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer maxWidth="sm">
      <TimerBar value={progress} variant="determinate" />
      <Typography variant="caption">{timerString}</Typography>
    </TimerContainer>
  );
}
