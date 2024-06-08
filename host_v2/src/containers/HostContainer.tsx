import React, { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { GameSessionState, APIClients, IGameSession, IAPIClients} from '@righton/networking';
import useInitHostContainer from '../hooks/useInitHostContainer';
import GameSessionContainer from './GameSessionContainer';
import LaunchContainer from './LaunchContainer';

interface HostContainerProps {
  apiClients: APIClients;
}

export default function HostContainer({apiClients}: HostContainerProps) {
  const gameSessionId = '0634dbc3-726c-48cb-ad5a-afed98293523';
  let backendGameSession: IGameSession | null = null;
  
  backendGameSession = useInitHostContainer(apiClients, gameSessionId || '');

  function RedirectToCentralIfMissing () {
    window.location.href = 'http://dev-central.rightoneducation.com/';
    return null;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {backendGameSession && gameSessionId && 
          <Route
            path="/host"        
            element={<GameSessionContainer backendGameSession={backendGameSession}/>}
            loader={useInitHostContainer(apiClients, gameSessionId)}
          />
        }
        {/* {gameId &&
          <Route
            path="/launch"
            element={<LaunchContainer apiClients={apiClients} gameId={gameId} />}
          />
        } */}
        <Route element={<RedirectToCentralIfMissing />} />
      </>,
    ),
  );

  return (
    <RouterProvider router={router} />
  )
}