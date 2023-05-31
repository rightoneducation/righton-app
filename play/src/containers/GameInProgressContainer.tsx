import React from 'react';
import {
  ApiClient,
  isNullOrUndefined
} from '@righton/networking';
import { redirect } from 'react-router-dom';
import useFetchAndSubscribeGameSession from '../hooks/useFetchAndSubscribeGameSession';
import GameSessionSwitch from '../components/GameSessionSwitch';
import HowToPlay from '../pages/pregame/HowToPlay';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameInProgressContainer(props:GameInProgressContainerProps) {
  const { apiClient } = props;
  const pregameModel = window.localStorage.getItem('rightOn');
  // if user doesn't have prexisting game info stored locally (from either pregame or dropped game), redirect to pregame
  if (isNullOrUndefined(pregameModel))
    return redirect('/');

  const parsedPregameModel = JSON.parse(pregameModel);
  // subscribes to gameSession using useSubscribeGameSession hook (uses useSyncExternalStore)
  const  subscription = useFetchAndSubscribeGameSession(parsedPregameModel.gameSessionId, apiClient);

  // if gamesession is loading or errored
  if (!subscription.gameSession){
    if (subscription.isLoading) 
      return <HowToPlay isLoading isError=''/>;
    return <HowToPlay isLoading={false} isError={subscription.error ?? 'sup'}/>;
  }
  // otherwise render GameSessionSwitch (which will initially render HowToPlay without intro or error conditions)
  return <GameSessionSwitch pregameModel={parsedPregameModel} gameSession={subscription.gameSession} {...props}/>
}