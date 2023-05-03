import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Congrats from '../components/finalresults/Congrats';
import { FinalResultsState } from '../lib/PlayModels';

interface FinalResultsProps {
  score: number;
  selectedAvatar: number;
  leader: boolean;
}

export default function FinalResults({ score, selectedAvatar, leader }: FinalResultsProps) {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [finalResultsState, setFinalResultsState] = useState(FinalResultsState.CONGRATS); // eslint-disable-line @typescript-eslint/no-unused-vars

  switch (finalResultsState) {
    case FinalResultsState.CONGRATS:
    default:
      return <Congrats score={score} isSmallDevice={isSmallDevice} selectedAvatar={selectedAvatar} leader={leader}/>;
  }
}
