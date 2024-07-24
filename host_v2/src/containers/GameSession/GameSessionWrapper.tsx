import React, { useEffect, useState } from 'react';
import {
  useMatch
} from 'react-router-dom';
import { APIClients } from '@righton/networking';
import useInitHostContainer from '../../hooks/useInitHostContainer';
import GameSessionContainer from './GameSessionContainer';
import LoadingPage from '../../pages/LoadingPage';

interface GameSessionWrapperProps {
  apiClients: APIClients;
}

export default function GameSessionWrapper({apiClients}: GameSessionWrapperProps) {
  const match = useMatch("/host/:gameSessionId");
  const gameSessionId = match?.params.gameSessionId;
  let backendGameSession = null;
  let backendHostTeamAnswers = null;
  try {
    const initResponse = useInitHostContainer(apiClients, gameSessionId ?? '');
    backendGameSession = initResponse.backendGameSession;
    backendHostTeamAnswers = initResponse.backendHostTeamAnswers;
  } catch (error) {
    console.log(error);
  }
  if (backendGameSession && backendHostTeamAnswers){
    return (
      (backendGameSession && backendHostTeamAnswers)
        ? <GameSessionContainer apiClients={apiClients} backendGameSession={backendGameSession} backendHostTeamAnswers={backendHostTeamAnswers} />
        : null
    )  
  }
  return (
    <LoadingPage />
  );
}