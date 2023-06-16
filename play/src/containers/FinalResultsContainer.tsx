import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ITeam, GameSessionState } from '@righton/networking';
import Leaderboard from '../pages/finalresults/Leaderboard';
import Congrats from '../pages/finalresults/Congrats';
import { FinalResultsState } from '../lib/PlayModels';

interface FinalResultsContainerProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  score: number;
  selectedAvatar: number;
  teamId: string;
  leader: boolean;
}

export default function FinalResultsContainer({
  teams,
  currentState,
  score,
  selectedAvatar,
  teamId,
  leader,
}: FinalResultsContainerProps) {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [finalResultsState, setFinalResultsState] = useState(
    FinalResultsState.CONGRATS
  );

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
          leader={leader}
          setFinalResultsState={() =>
            setFinalResultsState(FinalResultsState.LEADERBOARD)
          }
        />
      );
  }
}