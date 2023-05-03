import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ITeam, GameSessionState } from '@righton/networking';
import Leaderboard from '../components/finalresults/Leaderboard';
import Congrats from '../components/finalresults/Congrats';
import { FinalResultsState } from '../lib/PlayModels';

interface FinalResultsProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  score: number;
  selectedAvatar: number;
  teamId: string;
  leader: boolean;
  finalResultsState: FinalResultsState;
}

export default function FinalResults({ teams, currentState, score, selectedAvatar, teamId, leader, finalResultsState }: FinalResultsProps) {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  
  switch (finalResultsState) {
    case FinalResultsState.LEADERBOARD:
      return <Leaderboard teams={teams} currentState={currentState} teamAvatar={selectedAvatar} teamId={teamId} score={score} isSmallDevice={isSmallDevice}/>;
    case FinalResultsState.CONGRATS:
    default:
      return <Congrats score={score} isSmallDevice={isSmallDevice} selectedAvatar={selectedAvatar} leader={leader}/>;
  }
}
