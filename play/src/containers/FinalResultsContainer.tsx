import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [finalResultsState, setFinalResultsState] = useState(
    FinalResultsState.CONGRATS
  );

  const isLeader = (inputTeams: ITeam[], inputTeamID: string) => {
    inputTeams.sort((a, b) => b.score - a.score);
    if (inputTeams.length <= 5) {
      return true;
    }
    for (let idx = 0; idx < 5; idx += 1) {
      if (inputTeams[idx].id === inputTeamID) {
        return true;
      }
    }
    return false;
  };

  switch (finalResultsState) {
    case FinalResultsState.LEADERBOARD:
      return (
        <Leaderboard
          teams={teams}
          currentState={currentState}
          teamAvatar={selectedAvatar}
          teamId={teamId}
          isSmallDevice={isSmallDevice}
        />
      );
    case FinalResultsState.CONGRATS:
    default:
      return (
        <Congrats
          score={score}
          selectedAvatar={selectedAvatar}
          leader={
            !isNullOrUndefined(teams) && !isNullOrUndefined(teamId)
              ? isLeader(teams, teamId)
              : false
          }
          setFinalResultsState={() =>
            setFinalResultsState(FinalResultsState.LEADERBOARD)
          }
        />
      );
  }
}
