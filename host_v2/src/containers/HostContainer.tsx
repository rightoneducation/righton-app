import React, { useEffect, useState } from 'react';
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
  const gameSessionId = 'c0b8a77e-3581-4a69-aa5a-8d3aae69fe28';
  const {backendGameSession, backendHostTeamAnswers} = useInitHostContainer(apiClients, gameSessionId);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {backendGameSession && gameSessionId && 
          <Route
            path="/"
            element={<GameSessionContainer apiClients={apiClients} backendGameSession={backendGameSession} backendHostTeamAnswers={backendHostTeamAnswers}/>}
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