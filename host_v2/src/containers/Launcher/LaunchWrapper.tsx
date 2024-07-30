import React from 'react';
import {
  useMatch
} from 'react-router-dom';
import { APIClients } from '@righton/networking';
import LaunchContainer from './LaunchContainer';

interface LaunchWrapperProps {
  apiClients: APIClients;
}

export default function LaunchWrapper({apiClients}: LaunchWrapperProps) {
  const match = useMatch("/new/:gameId");
  const gameId = match?.params.gameId;
  if (gameId){
    return (
        <LaunchContainer apiClients={apiClients} gameId={gameId} />
    )  
  }
  return null;
}