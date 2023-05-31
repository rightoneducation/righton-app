import React from 'react';
import {
  ApiClient,
} from '@righton/networking';
import useFetchandSubscribeGameSession from '../hooks/useFetchandSubscribeGameSession';
import GameSessionSwitch from '../components/GameSessionSwitch';
import HowToPlay from '../pages/pregame/HowToPlay';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameInProgressContainer(props:GameInProgressContainerProps) {
  const { apiClient } = props;
  const pregameModel = JSON.parse(window.localStorage.getItem('rightOn') ?? '{}');
  // subscribes to gameSession using useSubscribeGameSession hook (uses useSyncExternalStore)
  const subscription = useFetchandSubscribeGameSession(pregameModel.gameSessionId, apiClient);

  if (!subscription.gameSession){
    if (subscription.isLoading) 
      return <HowToPlay isLoading isError=''/>;
    return <HowToPlay isLoading={false} isError={subscription.error ?? 'sup'}/>;
  }
  return <GameSessionSwitch pregameModel={pregameModel} gameSession={subscription.gameSession} {...props}/>
}