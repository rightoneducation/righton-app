import React, { useRef, useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { IGameSession, GameSessionState } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { GameSessionDispatchContext } from '../lib/context/GameSessionContext';
import { useTSDispatchContext } from '../hooks/context/useGameSessionContext';
import TimerAddButton from '../lib/styledcomponents/TimerAddButton';

const TimerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${theme.sizing.mdPadding}px`,
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
  isAddTime?: boolean;
  localGameSession: IGameSession;
}

export default function Timer({
  totalTime,
  isAddTime,
  localGameSession
}: TimerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const dispatch = useTSDispatchContext(GameSessionDispatchContext);
  const [timerString, setTimerString] = useState<string>('0:00');
  const [progress, setProgress] = useState<number>(0);

  const calculateCurrentTime = (startTime: number) => {
    if (startTime) {
        const difference = Date.now() - startTime;
        if (difference >= totalTime * 1000) {
          return 0;
        } 
        const remainingTime = totalTime - Math.trunc(difference / 1000);
        return remainingTime;
    }
    return 0;
  };
  const currentTimeMilli = useRef<number>(calculateCurrentTime(Number(localGameSession.startTime)) * 1000);
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const originalTimeRef = useRef<number | null>(null);
  const isTimerActiveRef = useRef<boolean>(false);

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
    if (isTimerActiveRef.current) {
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

  const handleAddTime = () => {
    const addedTime = 30;
    const addedStartTime = addedTime * 1000;
    // checks if the added time is greater than the total time
    const newStartTime = Math.min(Number(localGameSession.startTime) + addedStartTime, Date.now());
    currentTimeMilli.current = calculateCurrentTime(newStartTime) * 1000;
    apiClients.gameSession.updateGameSession({id: localGameSession.id, startTime: newStartTime.toString()});
    dispatch({type: 'synch_local_gameSession', payload: {...localGameSession, startTime: newStartTime}});
  }

  useEffect(() => {
    if ( localGameSession.currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER 
      && localGameSession.currentState !== GameSessionState.CHOOSE_TRICKIEST_ANSWER
    ) {
      isTimerActiveRef.current = false;
      currentTimeMilli.current = 0;
      setTimerString('0:00');
      setProgress(0);
      prevTimeRef.current = null;
    } else {
      currentTimeMilli.current = calculateCurrentTime(Number(localGameSession.startTime) ?? 0) * 1000;
    }
    console.log('triggered');
    if (currentTimeMilli.current > 0) {
      isTimerActiveRef.current = true;
      animationRef.current = requestAnimationFrame(updateTimer);
    }
   return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [localGameSession.currentState, localGameSession.startTime]); // eslint-disable-line
  return (
    <TimerContainer>
      <Box style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%',  gap: `calc(${theme.sizing.xSmPadding}px + ${theme.sizing.xxSmPadding}px)`, opacity: isTimerActiveRef.current ? 1 : 0.4,  }}>
        <TimerBar value={progress} variant="determinate"/>
        <Box style={{minWidth: '30px'}}>
          <Typography
            alignSelf="center"
            variant="h6"
            style={{ fontSize: '14px', fontWeight: '400', fontFamily: 'Rubik', lineHeight: '14px' }}
          >
            {timerString}
          </Typography>
        </Box>
      </Box>
      <TimerAddButton onClick={handleAddTime} disabled={currentTimeMilli.current <= 0}>
        <Typography variant="subtitle2" style={{ fontSize: '14px' }}>
          {t('gamesession.addtime')}
        </Typography>
      </TimerAddButton>
    </TimerContainer>
        
  );
}
