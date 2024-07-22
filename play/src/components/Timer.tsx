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
  handleTimerIsFinished: () => void;
}

export default function Timer({
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  handleTimerIsFinished,
}: TimerProps) {

  // TODO: 
  // 1. verify that this works ok, take a look at console.logs on start, refresh and tab 
  // 2. fix timerstring so that UI of timer works correctly:
  //   a. confirm that timerstring console.logs are accurate
  //   b. identify why timerstring.current doesn't work in the render function [<-***]
  // 3. Take out current timer in props and implement on your solution, moving calculation to this function and removing dummy zero value

  const currentTimeMilli = useRef<number>(currentTimer * 1000);
  const progress = (currentTimeMilli.current / (totalTime * 1000)) * 100;
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const originalTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(isPaused);
  const timerString = useRef<string>('');

  const getTimerString = (currentTimeInput: number) => {
    console.log(currentTimeInput);
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
    console.log(currentTimeMilli.current);
    if (!isPausedRef.current) {
      if (prevTimeRef.current != null) {
        const delta = timestamp - prevTimeRef.current;
        currentTimeMilli.current -= delta;
        timerString.current = getTimerString(currentTimeMilli.current);
        console.log(timerString.current); // <- this represents the timerstring in recursive function
      } else {
        originalTimeRef.current = timestamp;
        timerString.current = getTimerString(timestamp);
        console.log(timerString.current);
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
  }, [isPaused, isFinished, currentTimer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer maxWidth="sm">
      <TimerBar value={progress} variant="determinate" />
      <TimerText maxWidth="sm">
        <Typography alignSelf="center" variant="caption">
          {timerString.current} {/* this represents timerString in react state machine */}
        </Typography>
      </TimerText>
    </TimerContainer>
  );
}
