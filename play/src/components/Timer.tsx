import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { json } from 'stream/consumers';
import { GameSessionState } from '@righton/networking';

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
}: TimerProps) {
  const [currentTime, setCurrentTime] = useState(totalTime);
  const timeProgress = currentTime / totalTime * 100;

  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  let originalTime: number;

  const isPausedRef = useRef<boolean>(isPaused);

  // updates the current time as well as the localstorage in case of page reset
  useEffect(() => {
    let refreshIntervalId = setInterval(() => {
      if (currentTime > 0) {
        setCurrentTime(currentTime - 1);
        localStorage.setItem('currentGameTimeStore', JSON.stringify(currentTime - 1));
        animationRef.current = currentTime;
      } else {
        handleTimerIsFinished();
      }
    }, 1000);
    return () => clearInterval(refreshIntervalId);
  }, [currentTime]);

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
    if (!isPaused && !isFinished) {
      setCurrentTime(currentTime - 1);
      animationRef.current = currentTime;
    }
    return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the isPausedRef when the isPaused prop changes
  useEffect(() => {
    setCurrentTime(parseInt(JSON.parse(localStorage.getItem('currentGameTimeStore') as string)));
    isPausedRef.current = isPaused;
  }, [isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TimerContainer maxWidth="sm">
      <TimerBar value={timeProgress} variant="determinate" />
      <Typography variant="caption">{getTimerString(currentTime)}</Typography>
    </TimerContainer>
  );
}
