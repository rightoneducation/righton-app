import React, { useState, useRef } from 'react';
import {
  ITeam,
  GameSessionState,
  isNullOrUndefined,
} from '@righton/networking';
import Leaderboard from '../pages/finalresults/Leaderboard';
import Congrats from '../pages/finalresults/Congrats';
import { FinalResultsState } from '../lib/PlayModels';

interface FinalResultsContainerProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  score: number;
  selectedAvatar: number;
  teamId: string;
}

export default function FinalResultsContainer({
  teams,
  currentState,
  score,
  selectedAvatar,
  teamId,
}: FinalResultsContainerProps) {
  const [finalResultsState, setFinalResultsState] = useState(
    currentState === GameSessionState.FINAL_RESULTS 
      ? FinalResultsState.CONGRATS
      : FinalResultsState.LEADERBOARD
  );

  const isLeader = (inputTeams: ITeam[] | undefined, inputTeamID: string) => {
    if (!isNullOrUndefined(inputTeams) && !isNullOrUndefined(inputTeamID)) {
      inputTeams.sort((a, b) => b.score - a.score);
      if (inputTeams.slice(0, 5).find((team) => team.id === inputTeamID))
        return true;
    }
    return false;
  };
  const leader = useRef<boolean>(isLeader(teams, teamId));

  switch (finalResultsState) {
    case FinalResultsState.LEADERBOARD:
      return (
        <Leaderboard
          teams={teams}
          currentState={currentState}
          teamAvatar={selectedAvatar}
          teamId={teamId}
        />
      );
    case FinalResultsState.CONGRATS:
    default:
      return (
        <Congrats
          score={score}
          selectedAvatar={selectedAvatar}
          leader={leader.current}
          setFinalResultsState={() =>
            setFinalResultsState(FinalResultsState.LEADERBOARD)
          }
        />
      );
  }
}
