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

interface GameInProgressContainerProps {
  apiClients: IAPIClients;
}

export function GameInProgressContainer(props: GameInProgressContainerProps) {
  const { apiClients } = props;
  const [retry, setRetry] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
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
  // check which phase to get the right allotttted time
  let allottedTime = 0; // Initialize to default value

  if (subscription && subscription.gameSession) {
    const { currentState, phaseOneTime, phaseTwoTime } = subscription.gameSession;

    if (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
      allottedTime = phaseOneTime;
    } else if (currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
      allottedTime = phaseTwoTime;
    }
  }
  const calculateCurrentTime = () => {
    if (subscription && subscription.gameSession) {
      const getStartTime = subscription.gameSession?.startTime;
      if (getStartTime) {
        const isoTimeMillis = new Date(getStartTime).getTime();
        const difference = Date.now() - isoTimeMillis;

        if (difference >= allottedTime * 1000) {
          // setCurrentTime(-1);
          return -1;
        } 
        const remainingTime = allottedTime - Math.trunc(difference / 1000);
        // setCurrentTime(remainingTime);
        // window.localStorage.setItem('currentTime', remainingTime.toString());
        return remainingTime;
      }
    }
    return 0;
  };
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCurrentTime(calculateCurrentTime());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [subscription]); // eslint-disable-line

  // if date.now - the starttime > allotted time then timeer is 0 question is done
  console.log("outside CurrentTime");
  console.log(currentTime);
  
  useEffect(() => {
    if (subscription.hasRejoined) {
      setCurrentTime(calculateCurrentTime());
    }
  }, [subscription, subscription.hasRejoined]); // eslint-disable-line

  // const playTime = Date.now();
  // if 
  // else currenTime = date.now - the startTime
  // put the above in the const below. but put it in a pretty ternary
  // const currentTime = subscription.gameSession?.startTime

  // if there isn't data in localstorage automatically redirect to the splashscreen
  if (isNullOrUndefined(localModel)) return <Navigate replace to="/" />;

  // if gamesession is loading/errored/waiting for teacher to start game
  if (
    isNullOrUndefined(subscription.gameSession) ||
    subscription.gameSession.currentState === GameSessionState.TEAMS_JOINING
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
  console.log("right before return");
  console.log(currentTime);
  console.log(localModel.currentTimer);
  console.log(localModel.currentTime);
  // if teacher has started game, pass updated gameSession object down to GameSessionSwitch
  return (
    <GameSessionSwitch
      currentTimer={currentTime}
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
