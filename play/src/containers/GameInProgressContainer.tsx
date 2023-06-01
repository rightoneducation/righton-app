import React from 'react';
import {
  ApiClient
} from '@righton/networking';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [retry, setRetry] = React.useState<number>(0);
  // text hoisted so that we can listen to changes in retry state and update according to returned value from custom hook
  const [errorText, setErrorText] = React.useState<{title1:string, title2:string}>({title1: t('joingame.errormodal.title1'), title2: ''});
  
  // if user clicks retry on the error modal, increment retry state to force a rerender and another call to the api
  const handleRetry = () => {
    setErrorText({title1: 'Trying to reconnect...', title2: ''});
    setRetry(retry + 1);
  };
  
  // loads game data from local storage
  // if no game data, redirects to splashscreen
  const pregameModel = useFetchLocalData();
  // uses local game data to subscribe to gameSession 
  // fetches gameSession first, then subscribes to data, finally returns object with loading, error and gamesession 
  const  subscription = useFetchAndSubscribeGameSession(pregameModel.gameSessionId, apiClient, retry);

  // this listens for changes to subscription and updates the error text accordingly
  React.useEffect(() => {
    setErrorText({title1: t('joingame.errormodal.title1'), title2: subscription.error ?? 'Game Session Could Not Be Found'});
  }, [subscription, t]);
  
  // if gamesession is loading/errored/waiting for teacher to start game
  if (!subscription.gameSession){
    // if errored, show howToPlay page and error modal
    if (subscription.error){
      return (
        <>
          <HowToPlay isLoading={false} isError />
          <AlertModal errorText={errorText} retry={retry} handleRetry={handleRetry}/>
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