import React, { useState, useEffect } from 'react';
import {
  IAPIClients,
  isNullOrUndefined,
  GameSessionState,
} from '@righton/networking';
import { Navigate, useLoaderData } from 'react-router-dom';
import useFetchAndSubscribeGameSession from '../hooks/useFetchAndSubscribeGameSession';
import GameSessionSwitch from '../components/GameSessionSwitch';
import Lobby from '../pages/pregame/Lobby';
import ErrorModal from '../components/ErrorModal';
import {
  LobbyMode,
  LocalModel,
  StorageKey,
  StorageKeyAnswer,
  StorageKeyHint,
  ErrorType,
} from '../lib/PlayModels';
import { calculateCurrentTime } from '../lib/HelperFunctions';

interface GameInProgressContainerProps {
  apiClients: IAPIClients;
}

export function GameInProgressContainer(props: GameInProgressContainerProps) {
  const { apiClients } = props;
  const [retry, setRetry] = useState<number>(0);
  
  // if user clicks retry on the error modal, increment retry state to force a rerender and another call to the api
  const handleRetry = () => {
    setRetry(retry + 1);
  };
  // retreives game data from react-router loader
  // if no game data, redirects to splashscreen
  const localModel = useLoaderData() as LocalModel;
  // uses local game data to subscribe to gameSession
  // fetches gameSession first, then subscribes to data, finally returns object with loading, error and gamesession

  const subscription = useFetchAndSubscribeGameSession(
    localModel?.gameSessionId,
    apiClients,
    retry,
    localModel?.hasRejoined,
    localModel?.teamId,
  );
  console.log(subscription.newPoints);


  // if there isn't data in localstorage automatically redirect to the splashscreen
  if (isNullOrUndefined(localModel)) return <Navigate replace to="/" />;

  // if gamesession is loading/errored/waiting for teacher to start game
  if (
    isNullOrUndefined(subscription.gameSession) ||
    (subscription.gameSession.currentState === GameSessionState.TEAMS_JOINING 
      && subscription.gameSession.currentQuestionIndex === null)
  ) {
    // if player is rejoining, show lobby in rejoining mode
    if (
      subscription.hasRejoined === true &&
      subscription.gameSession?.currentState !== GameSessionState.TEAMS_JOINING
    ) {
      return <Lobby mode={LobbyMode.REJOIN} />;
    }
    // if errored, show howToPlay page and error modal
    if (subscription.error) {
      return (
        <>
          <ErrorModal
            isModalOpen
            errorType={ErrorType.CONNECT}
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
    if (
      subscription.gameSession?.currentQuestionIndex != null &&
      subscription.gameSession?.currentQuestionIndex > 0
    ) {
      return (
        <Lobby
          mode={LobbyMode.PREQUESTION}
          teams={subscription.gameSession.teams}
          currentState={subscription.gameSession.currentState}
          teamAvatar={localModel.selectedAvatar}
          teamId={localModel.teamId}
        />
      );
    }
    // if waiting for teacher, display waiting message on How to Play page
    return <Lobby mode={LobbyMode.READY} />;
  }
  
  return (
    <GameSessionSwitch
      currentTimer={subscription.currentTime}
      isAddTime={subscription.isAddTime}
      hasRejoined={subscription.hasRejoined}
      localModel={localModel}
      gameSession={subscription.gameSession}
      newPoints={subscription.newPoints}
      {...props}
    />
  );
}

export function LocalModelLoader(): LocalModel {
  // localModelBase and localModelAnswer are stored separately so that
  // changes to the timer and changes to the short answer response pad don't conflict
  const localModelBase = JSON.parse(
    window.localStorage.getItem(StorageKey) ?? '{}'
  );
  const localModelAnswer = JSON.parse(
    window.localStorage.getItem(StorageKeyAnswer) ?? '{}'
  );
  const localModelHint = JSON.parse(
    window.localStorage.getItem(StorageKeyHint) ?? '{}'
  );
  const localModel = { ...localModelBase, answer: localModelAnswer, hint: localModelHint };
  if (localModel && !localModel.hasRejoined) {
    const updatedModelForNextReload = { ...localModel, hasRejoined: true };
    window.localStorage.setItem(
      StorageKey,
      JSON.stringify(updatedModelForNextReload)
    );
  }
  return localModel;
}