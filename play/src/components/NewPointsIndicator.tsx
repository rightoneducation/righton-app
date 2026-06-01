import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { GameSessionState } from '@righton/networking';

interface ScorePillInterface {
  theme: any;
  currentState: GameSessionState;
}

const ScorePill = styled('div', {
  shouldForwardProp: (prop) => prop !== 'currentState',
})(({ theme, currentState }: ScorePillInterface) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '58px',
  height: '22px',
  borderRadius: '23px',
  background: currentState === GameSessionState.PHASE_1_DISCUSS ? `${theme.palette.primary.altHighlightGradient}` : `${theme.palette.designSystem.surface.deepPurple}`,
  zIndex: 2,
}));

const NewPointsPill = styled(ScorePill)({
  zIndex: 2,
});

const NewPointsAnimation = styled('div')({
  opacity: 0, 
  animation: `
   newScoreUpWiggle 1500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms forwards
  `,
  '@keyframes newScoreUpWiggle': {
    '0%': {
      opacity: 0,
      transform: 'rotate(0deg) scale(1.0)',
    },
    '5%': {
      opacity: 1,
      transform: 'rotate(0deg) scale(1.2)',
    },
    '15%, 55%': {
      opacity: 1,
      transform: 'rotate(-12deg) scale(1.2)',
    },
    '25%, 65%': {
      opacity: 1,
      transform: 'rotate(12deg) scale(1.2)',
    },
    '35%, 75%': {
      opacity: 1,
      transform: 'rotate(-8deg) scale(1.2)',
    },
    '45%, 85%': {
      opacity: 1,
      transform: 'rotate(8deg) scale(1.2)',
    },
    '90%': {
      opacity: 1,
      transform: 'rotate(0deg) scale(1.2)',
    },
    '95%': {
      opacity: 1,
      transform: 'rotate(0deg) scale(1.0)',
    },
    '100%': {
      opacity: 1,
      transform: 'rotate(0deg) scale(1.0)',
    },
  },
});

interface NewPointsIndicatorProps {
  newPoints?: number;
  score: number;
  currentState: GameSessionState;
}

export default function NewPointsIndicator({
  newPoints,
  score,
  currentState,
}: NewPointsIndicatorProps) {
  const [newScore, setNewScore] = useState(score);
  const [startScoreAnimation, setStartScoreAnimation] = useState(false);

  const handlePointsAnimationEnd = (event: React.AnimationEvent) => {
    if (
      event.animationName === 'newScoreUpWiggle' &&
      newPoints &&
      newPoints > 0
    ) {
      setNewScore(score + newPoints);
      setStartScoreAnimation(true);
    }
  };

  return (
    <Box sx={{ display: 'flex'}}>
      {newPoints && newPoints > 0 ? (
        <NewPointsAnimation onAnimationEnd={handlePointsAnimationEnd}>
          <NewPointsPill currentState={currentState}>
            <Typography variant="h2">{`+${newPoints}`}</Typography>
          </NewPointsPill>
        </NewPointsAnimation>
      ) : null}
    </Box>
  );
}
