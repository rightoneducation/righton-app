import React, { useState } from 'react';
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
}
const ScoreAnimation = styled('div', {
  shouldForwardProp: (prop) => prop !== 'startAnimation',
})<ScoreAnimationProps>(({ startAnimation }) => ({
  opacity: 1,
  zIndex: 2,
  animation: startAnimation
    ? `
   scoreGrow 1000ms ease-in-out 0ms
  `
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

const NewPointsPill = styled(ScorePill)(({ theme }) => ({
  background: `${theme.palette.primary.altHighlightGradient}`,
  zIndex: 2,
}));

const NewPointsAnimation = styled('div')({
  opacity: 0,
  position: 'absolute',
  zIndex: 2,
  animation: `
   newScoreUpWiggle 1500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
   newScoreUpFadeDown 1000ms ease-in-out 1500ms
  `,
  '@keyframes newScoreUpWiggle': {
    '0%': {
      transform: 'translateY(70%) rotate(0deg) scale(1.0)',
    },
    '10%': {
      opacity: 1,
      transform: 'translateY(70%) rotate(0deg) scale(1.2)',
    },
    '15%, 45%, 75%': {
      opacity: 1,
      transform: ' translateY(70%) rotate(-12deg) scale(1.2)',
    },
    '30%, 60%': {
      opacity: 1,
      transform: 'translateY(70%) rotate(12deg) scale(1.2)',
    },
    '90%': {
      opacity: 1,
      transform: 'translateY(70%) rotate(0deg) scale(1.2)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(70%) rotate(0deg) scale(1.0)',
    },
  },
  '@keyframes newScoreUpFadeDown': {
    '0%': {
      opacity: 1,
      transform: 'translateY(70%)',
    },
    '100%': {
      transform: 'translateY(100%)',
    },
  },
});

interface DACScoreIndicatorProps {
  newPoints?: number;
  score: number;
}

export default function DACScoreIndicator({
  newPoints,
  score,
}: DACScoreIndicatorProps) {
  const [newScore, setNewScore] = useState(score);
  const [startScoreAnimation, setStartScoreAnimation] = useState(false);

  const handlePointsAnimationEnd = (event: React.AnimationEvent) => {
    if (
      event.animationName === 'newScoreUpFadeDown' &&
      newPoints &&
      newPoints > 0
    ) {
      setNewScore(score + newPoints);
      setStartScoreAnimation(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width:'200px' }}>
      {newPoints && newPoints > 0 ? (
        <NewPointsAnimation onAnimationEnd={handlePointsAnimationEnd}>
          <NewPointsPill>
            <Typography variant="overline">{`+${newPoints}`}</Typography>
          </NewPointsPill>
        </NewPointsAnimation>
      ) : null}
    </Box>
  );
}
