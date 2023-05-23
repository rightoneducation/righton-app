import React, { useState } from 'react';
import {
  ApiClient,
} from '@righton/networking';
import PregameContainer from './PregameContainer';
import GameInProgressContainer from './GameInProgressContainer';
import { PregameModel, OverallGameState } from '../lib/PlayModels';

interface GameSessionContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer({
  apiClient,
}: GameSessionContainerProps) {
  const [overallGameState, setOverallGameState] = useState<OverallGameState>(OverallGameState.PREGAME);
  const [pregameModel, setPreGameModel] = useState<PregameModel | null>(null);

  // when a player selects a team avatar, we need to advance them to GameInProgress (where they will be subscribed to the game session)
  // TODO: add in rejoin functionality, starting here
  const handlePregameFinished = (
    pregameData: PregameModel
  ) => {
    setPreGameModel(pregameData);
    setOverallGameState(OverallGameState.GAME_IN_PROGRESS);
  };

  const handleGameInProgressFinished = () => {
    setPreGameModel(null);
    setOverallGameState(OverallGameState.PREGAME);
  };

  switch (overallGameState) {
    case OverallGameState.GAME_IN_PROGRESS:
      return (
        <GameInProgressContainer
          apiClient={apiClient}
          pregameModel={pregameModel!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
          handleGameInProgressFinished={handleGameInProgressFinished}
        />
      );
    case OverallGameState.PREGAME:
    default:
      return (
        <PregameContainer
          handlePregameFinished={(pregameData: PregameModel) =>
            handlePregameFinished(pregameData)
          }
        />
      );
  }
}
