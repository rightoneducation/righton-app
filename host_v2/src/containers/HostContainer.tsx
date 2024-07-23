import React, { useEffect, useState } from 'react';
import {
  useMatch
} from 'react-router-dom';
import { APIClients } from '@righton/networking';
import useInitHostContainer from '../hooks/useInitHostContainer';
import GameSessionContainer from './GameSessionContainer';
import LaunchContainer from './LaunchContainer';

interface HostContainerProps {
  apiClients: APIClients;
}

export default function HostContainer({apiClients}: HostContainerProps) {
  const match = useMatch("/host/:gameSessionId");
  const matchNew = useMatch("/new/:gameId");
  
  const gameId = matchNew?.params.gameId;
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

  if (matchNew){
    
    return (
        <LaunchContainer apiClients={apiClients} gameId={gameId ?? ''} />
      )
  }
  if (match){
  
    return (
      (backendGameSession && backendHostTeamAnswers)
        ? <GameSessionContainer apiClients={apiClients} backendGameSession={backendGameSession} backendHostTeamAnswers={backendHostTeamAnswers} />
        : null
    )  
  }
  window.location.href = 'http://dev-central.rightoneducation.com/';
  return null;
}