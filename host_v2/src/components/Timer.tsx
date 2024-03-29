import React, { useRef, useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { LocalModel, StorageKey } from '../lib/HostModels';

const TimerContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: `-${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.extraExtraLargePadding}px`,
  marginTop: `${theme.sizing.extraSmallPadding}px`,
  marginBottom: `${theme.sizing.extraSmallPadding}px`,
}));

const TimerBar = styled(LinearProgress)(({ theme }) => ({
  borderRadius: '40px',
  display: 'inline-block',
  marginRight: `${theme.sizing.extraSmallPadding}px`,
  height: `${theme.sizing.extraSmallPadding}px`,
  width: `calc(100% - ${theme.sizing.mediumPadding}px)`,
  backgroundColor: theme.palette.primary.baseQuestionColor,
  '& .MuiLinearProgress-bar': {
    background: theme.palette.primary.main,
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
  localModel: LocalModel;
}

export default function Timer({
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  localModel,
}: TimerProps) {
  const [currentTimeMilli, setCurrentTimeMilli] = useState(currentTimer * 1000); // millisecond updates to smooth out progress bar
  const currentTime = Math.trunc(currentTimeMilli / 1000);
  const progress = (currentTimeMilli / (totalTime * 1000)) * 100;

  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  let originalTime: number;
  const isPausedRef = useRef<boolean>(isPaused);

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
      } else {
        //  handleTimerIsFinished();
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
    <TimerContainer maxWidth="md">
      <TimerBar value={progress} variant="determinate" />
      <TimerText maxWidth="sm">
        <Typography
          alignSelf="center"
          variant="h6"
          style={{ fontSize: '14px', fontWeight: '400', fontFamily: 'Rubik' }}
        >
          {timerString}
        </Typography>
      </TimerText>
    </TimerContainer>
  );
}
