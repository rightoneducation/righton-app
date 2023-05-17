import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined } from '@righton/networking';

const ScorePill = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: `58px`,
  height: '22px',
  borderRadius: '23px',
  background: `${theme.palette.primary.highlightGradient}`,
  zIndex: 1,
}));

const NewPointsPill = styled(ScorePill)(({ theme }) => ({
  background: `${theme.palette.primary.altHighlightGradient}`,
  zIndex: 2,
}));

const NewPointsAnimation = styled('div')({
  animation: `newScoreUp 1000ms cubic-bezier(0.4, 0, 0.2, 1)`,
  opacity: 0,
  position: 'absolute',
  zIndex: 2,
  '@keyframes newScoreUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-110%)',
    },
    '50%': {
      opacity: 1,
      transform: 'translateY(-110%)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

interface ScoreIndicatorProps {
  newPoints?: number;
  score: number;
  handleUpdateScore?: (newScore: number) => void;
}

export default function ScoreIndicator({
  newPoints,
  score,
  handleUpdateScore
}: ScoreIndicatorProps) {

  // adds an eventLister to add the new points to the existing score when the animation completes
  useEffect(() => {
    const element = document.getElementById('newPointsAnimation');
    const handleAnimationEnd = () => {
      if (newPoints && newPoints > 0 && handleUpdateScore){
        handleUpdateScore(score + newPoints);
      }
    };
    element?.addEventListener('animationend', handleAnimationEnd);
    return () => {
      element?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [newPoints]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <NewPointsAnimation id="newPointsAnimation">
        {newPoints && newPoints > 0 ? (
          <NewPointsPill>
            <Typography variant="overline">{`+${newPoints}`}</Typography>
          </NewPointsPill>
        ) : null}
      </NewPointsAnimation>
      <ScorePill>
        <Typography variant="overline">
          {isNullOrUndefined(score) ? 0 : score}
        </Typography>
      </ScorePill>
    </Box>
  );
}
