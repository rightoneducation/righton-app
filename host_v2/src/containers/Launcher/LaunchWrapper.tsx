import React from 'react';
import {
  useMatch
} from 'react-router-dom';
import { IAPIClients } from '@righton/networking';
import LaunchContainer from './LaunchContainer';

interface LaunchWrapperProps {
  apiClients: IAPIClients;
}

export default function LaunchWrapper({apiClients}: LaunchWrapperProps) {
  const match = useMatch("/new/:publicPrivate/:gameId");
  const gameId = match?.params.gameId;
  console.log('here')
  if (gameId){
    return (
        <LaunchContainer apiClients={apiClients} gameId={gameId} />
    )  
  }
  return null;
}