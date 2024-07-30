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
  // const gameSessionId = 'e423d50d-ace3-4860-8354-75f9b7f59846';
  const gameSessionId = '372940a9-be25-4a22-b5ec-4f9b010f002b';
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