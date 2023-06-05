import React, { useState } from 'react';
import {
  ApiClient,
  isNullOrUndefined,
  GameSessionState
} from '@righton/networking';
import { Navigate, useLoaderData } from 'react-router-dom';
import useFetchLocalData from '../hooks/useFetchLocalData';
import useFetchAndSubscribeGameSession from '../hooks/useFetchAndSubscribeGameSession';
import GameSessionSwitch from '../components/GameSessionSwitch';
import Lobby from '../pages/pregame/Lobby';
import AlertModal from '../components/AlertModal';
import { LobbyMode, PregameModel } from '../lib/PlayModels';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export function GameInProgressContainer(
  props: GameInProgressContainerProps
) {
  const { apiClient } = props;
  const [retry, setRetry] = useState<number>(0);
  // if user clicks retry on the error modal, increment retry state to force a rerender and another call to the api
  const handleRetry = () => {
    setRetry(retry + 1);
  };
  // loads game data from local storage
  // if no game data, redirects to splashscreen
  const pregameModel = useLoaderData() as PregameModel;
  console.log(pregameModel);
  // uses local game data to subscribe to gameSession
  // fetches gameSession first, then subscribes to data, finally returns object with loading, error and gamesession
  const subscription = useFetchAndSubscribeGameSession(
    pregameModel?.gameSessionId,
    apiClient,
    retry,
    pregameModel?.isRejoin
  );
  // if there isn't data in localstorage automatically redirect to the splashscreen
  if (isNullOrUndefined(pregameModel)) return <Navigate replace to="/" />;
  // if gamesession is loading/errored/waiting for teacher to start game
  if (!subscription.gameSession || subscription.gameSession.currentState === GameSessionState.TEAMS_JOINING) {
    // if player is rejoining, show lobby in rejoining mode
    if (pregameModel.isRejoin === true) {
      return <Lobby mode={LobbyMode.REJOIN} />;
    }
    // if errored, show howToPlay page and error modal
    if (subscription.error) {
      return (
        <>
          <AlertModal
            errorText={subscription.error}
            retry={retry}
            handleRetry={handleRetry}
          />
          <Lobby mode={LobbyMode.ERROR} />
        </>
      );
    }
    // if loading, display loading message on bottom of How to Play page
    if (subscription.isLoading) return <Lobby mode={LobbyMode.LOADING} />;
    // if waiting for teacher, display waiting message on How to Play page
    return <Lobby mode={LobbyMode.READY} />;
  }
  // if teacher has started game, pass updated gameSession object down to GameSessionSwitch
  return (
    <GameSessionSwitch
      isRejoin={subscription.isRejoin}
      pregameModel={pregameModel}
      gameSession={subscription.gameSession}
      {...props}
    />
  );
}

export function GameInProgressContainerLoader(){
  let pregameModel = useFetchLocalData();
  if (!pregameModel.firstLaunch) {
    pregameModel = { ...pregameModel, isRejoin: true };
  } else {
    pregameModel = { ...pregameModel, firstLaunch: false };
  }
  window.localStorage.setItem('rightOn', JSON.stringify(pregameModel));
  return pregameModel;
}