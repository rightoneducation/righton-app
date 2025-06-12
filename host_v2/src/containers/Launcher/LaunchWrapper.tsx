import React from 'react';
import {
  useMatch
} from 'react-router-dom';
import { IAPIClients, PublicPrivateType } from '@righton/networking';
import LaunchContainer from './LaunchContainer';

interface LaunchWrapperProps {
  apiClients: IAPIClients;
}

export default function LaunchWrapper({apiClients}: LaunchWrapperProps) {
  const match = useMatch("/new/:publicPrivate/:gameId");
  const gameId = match?.params.gameId;
  const publicPrivate = match?.params.publicPrivate;
  
  const isPublicPrivateValid = (x: any): x is PublicPrivateType => {
    return Object.values(PublicPrivateType).includes(x);
  }

  const parsedPublicPrivate = isPublicPrivateValid(publicPrivate) ? publicPrivate : PublicPrivateType.PUBLIC;
  
  if (gameId){
    return (
        <LaunchContainer apiClients={apiClients} gameId={gameId} publicPrivate={parsedPublicPrivate}/>
    )  
  }
  return null;
}