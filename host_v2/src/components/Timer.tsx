import React, { useRef, useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { IGameSession, GameSessionState } from '@righton/networking';
import { LocalModel, StorageKey } from '../lib/HostModels';

const TimerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: `calc(${theme.sizing.xSmPadding}px + ${theme.sizing.xxSmPadding}px)`,
}));

const TimerBar = styled(LinearProgress)(({ theme }) => ({
  borderRadius: '40px',
  display: 'inline-block',
  height: `${theme.sizing.xSmPadding}px`,
  width: '100%',
  backgroundColor: theme.palette.primary.baseQuestionColor,
  '& .MuiLinearProgress-bar': {
    background: theme.palette.primary.main,
  },
}));

interface TimerProps {
  totalTime: number;
  currentTimer: number;
  isPaused: boolean;
  isFinished: boolean;
  isAddTime?: boolean;
  localGameSession: IGameSession;
}

export default function Timer({
  totalTime,
  currentTimer,
  isPaused,
  isFinished,
  isAddTime,
  localGameSession
}: TimerProps) {
  const theme = useTheme();
  const isTimerActive = 
    localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
    localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER;
  const [timerString, setTimerString] = useState<string>('0:00');
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
        // dont do anything if less than 0
      } 
      else {
        prevTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(updateTimer);
      }
    }
  }
  useEffect(() => {
    if ( localGameSession.currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER 
      && localGameSession.currentState !== GameSessionState.CHOOSE_TRICKIEST_ANSWER
    ) {
      isPausedRef.current = true;
      currentTimeMilli.current = 0;
    } else {
      currentTimeMilli.current = currentTimer * 1000;
    }
    if (currentTimer > 0) {
      isPausedRef.current = isPaused;
      if (!isPaused) {
        // animationRef.current = requestAnimationFrame(updateTimer);
      }
    }
   return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [isPaused, isFinished, isAddTime, currentTimer, localGameSession.currentState]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <TimerContainer style={{opacity: isTimerActive ? 1 : 0.4}}>
      <TimerBar value={progress} variant="determinate"/>
      <Typography
        alignSelf="center"
        variant="h6"
        style={{ width: `${theme.sizing.lgPadding}`, fontSize: '14px', fontWeight: '400', fontFamily: 'Rubik', lineHeight: '14px' }}
      >
        {timerString}
      </Typography>
    </TimerContainer>
  );
}
