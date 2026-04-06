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
  zIndex: 2,
}));

interface ScoreAnimationProps {
  startAnimation: boolean;
  animationDelay: number;
}
const ScoreAnimation = styled('div', {
  shouldForwardProp: (prop) => prop !== 'startAnimation' && prop !== 'animationDelay',
})<ScoreAnimationProps>(({ startAnimation, animationDelay }) => ({
  opacity: 1,
  zIndex: 2,
  animation: startAnimation
    ? `scoreGrow 1000ms ease-in-out ${animationDelay}ms`
    : ``,
  '@keyframes scoreGrow': {
    '0%, 100%': {
      opacity: 1,
      transform: ' scale(1.0)',
    },
    '50%': {
      opacity: 1,
      transform: ' scale(1.2)',
    },
  },
}));

interface ScoreIndicatorProps {
  newPoints?: number;
  score: number;
  animationDelay?: number;
}

export default function ScoreIndicator({
  newPoints,
  score,
  animationDelay = 1650,
}: ScoreIndicatorProps) {
  const [newScore, setNewScore] = useState(score);
  const [startScoreAnimation, setStartScoreAnimation] = useState(false);

  useEffect(() => {
    if (newPoints && newPoints > 0) {
      setNewScore(score + newPoints);
      setStartScoreAnimation(true);
    }
  }, [newPoints, score]);

  return (
    <Box>
      <ScoreAnimation startAnimation={startScoreAnimation} animationDelay={animationDelay}>
        <ScorePill>
          <Typography data-testid="scoreindicator-newpoints" variant="overline">
            {isNullOrUndefined(newScore) ? 0 : newScore}
          </Typography>
        </ScorePill>
      </ScoreAnimation>
    </Box>
  );
}
