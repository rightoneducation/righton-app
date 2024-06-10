import React, { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
  Route,
  Routes,
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
  const gameSessionId = '578b2bb8-448d-4040-8eb5-c6fec7bfb333';
  const backendGameSession = useInitHostContainer(apiClients, gameSessionId);

  function RedirectToCentralIfMissing () {
    window.location.href = 'http://dev-central.rightoneducation.com/';
    return null;
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {backendGameSession && gameSessionId && 
          <Route
            path="/"        
            element={<GameSessionContainer backendGameSession={backendGameSession}/>}
          />
        }
        {!backendGameSession &&
          <Route
            path="*"
            element={<LaunchContainer />}
          />
        }
      </>
    ),
  );

  return (
    <RouterProvider router={router} />
  )
}