import React, { useEffect, useState } from 'react';
import {
  useMatch
} from 'react-router-dom';
import { APIClients } from '@righton/networking';
import { APIClientsContext } from '../../lib/context/ApiClientsContext';
import { GameSessionContext, GameSessionDispatchContext } from '../../lib/context/GameSessionContext';
import { GameSessionReducer } from '../../lib/reducer/GameSessionReducer';
import { HostTeamAnswersContext, HostTeamAnswersDispatchContext } from '../../lib/context/HostTeamAnswersContext';
import { useTSDispatchContext } from '../../hooks/context/useGameSessionContext';
import { HostTeamAnswersReducer } from '../../lib/reducer/HostTeamAnswersReducer';
import useInitHostContainer from '../../hooks/useInitHostContainer';
import GameSessionContainer from './GameSessionContainer';
import LoadingPage from '../../pages/LoadingPage';

interface GameSessionWrapperProps {
  apiClients: APIClients;
}

export default function GameSessionWrapper({apiClients}: GameSessionWrapperProps) {
  const match = useMatch("/host/:gameSessionId");
  const gameSessionId = match?.params.gameSessionId;
  const { gameSession, hostTeamAnswers, dispatch, dispatchHostTeamAnswers } = useInitHostContainer(apiClients, gameSessionId ?? '');
  console.log('Host Team Answers');
  console.log(hostTeamAnswers);
  if (gameSession && hostTeamAnswers && Object.keys(gameSession).length !== 0 && Object.keys(hostTeamAnswers).length !== 0) {
    return (
        <APIClientsContext.Provider value={apiClients}>
        <HostTeamAnswersContext.Provider value={hostTeamAnswers}>
          <HostTeamAnswersDispatchContext.Provider value={dispatchHostTeamAnswers}>
            <GameSessionContext.Provider value={gameSession}>
              <GameSessionDispatchContext.Provider value={dispatch}>
            <GameSessionContainer apiClients={apiClients} gameSession={gameSession} hostTeamAnswers={hostTeamAnswers} />
          </GameSessionDispatchContext.Provider>
            </GameSessionContext.Provider>
          </HostTeamAnswersDispatchContext.Provider>
        </HostTeamAnswersContext.Provider>
      </APIClientsContext.Provider>
    )  
  }
  return (
    <LoadingPage />
  );
}