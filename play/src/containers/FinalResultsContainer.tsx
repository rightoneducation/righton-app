import React, { useState, useRef, useEffect } from 'react';
import {
  ITeam,
  GameSessionState,
  isNullOrUndefined,
} from '@righton/networking';
import Leaderboard from '../pages/finalresults/Leaderboard';
import Congrats from '../pages/finalresults/Congrats';
import { FinalResultsState, StorageKey, StorageKeyEduDataStudentId } from '../lib/PlayModels';

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

  // Only clear local identity at genuine game end (FINAL_RESULTS). This component is
  // also mounted for mid-game TEAMS_JOINING transients (via GameSessionSwitch), and
  // wiping StorageKey there gutted the student's gameSessionId — causing a spurious
  // "Game session not found" error on the next refresh.
  useEffect(() => {
    if (currentState === GameSessionState.FINAL_RESULTS) {
      window.localStorage.removeItem(StorageKey);
      window.localStorage.removeItem(StorageKeyEduDataStudentId);
    }
  }, [currentState]);

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
