import React from 'react';
import {
  ApiClient
} from '@righton/networking';
import useFetchLocalData from '../hooks/useFetchLocalData';
import useFetchAndSubscribeGameSession from '../hooks/useFetchAndSubscribeGameSession';
import GameSessionSwitch from '../components/GameSessionSwitch';
import HowToPlay from '../pages/pregame/HowToPlay';
import AlertModal from '../components/AlertModal';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameInProgressContainer(props:GameInProgressContainerProps) {
  const { apiClient } = props;
  const [retry, setRetry] = React.useState<number>(0);
  // if user clicks retry on the error modal, increment retry state to force a rerender and another call to the api
  const handleRetry = () => {
    setRetry(retry + 1);
  };
  
  // loads game data from local storage
  // if no game data, redirects to splashscreen
  const pregameModel = useFetchLocalData();
  // uses local game data to subscribe to gameSession 
  // fetches gameSession first, then subscribes to data, finally returns object with loading, error and gamesession 
  const  subscription = useFetchAndSubscribeGameSession(pregameModel.gameSessionId, apiClient, retry);

  // if gamesession is loading/errored/waiting for teacher to start game
  if (!subscription.gameSession){
    // if errored, show howToPlay page and error modal
    if (subscription.error.title2){
      return (
        <>
          <HowToPlay isLoading={false} isError />
          <AlertModal errorText={subscription.error} retry={retry} handleRetry={handleRetry}/>
        </>
      );
    }
    // if loading, display loading message on bottom of How to Play page
    if (subscription.isLoading) 
      return <HowToPlay isLoading isError={false} />;
    // if waiting for teacher, display waiting message on How to Play page
    return <HowToPlay isLoading={false} isError={false} />;
  }
  // if teacher has started game, pass updated gameSession object down to GameSessionSwitch
  return <GameSessionSwitch pregameModel={pregameModel} gameSession={subscription.gameSession} {...props}/>
}