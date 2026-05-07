import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined } from '@righton/networking';

const PillBase = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '60px',
  height: '22px',
  borderRadius: '23px',
});

const ScorePill = styled(PillBase)(({ theme }) => ({
  background: `${theme.palette.designSystem.surface.pink}`,
  zIndex: 2,
}));

interface FloatingPillProps {
  animationDelay: number;
}
const FloatingPill = styled(PillBase, {
  shouldForwardProp: (prop) => prop !== 'animationDelay',
})<FloatingPillProps>(({ theme, animationDelay }) => ({
  position: 'absolute',
  top: '-44px',
  left: '50%',
  background: theme.palette.designSystem.gradients.play.newScore,
  opacity: 0,
  transform: 'translateX(-50%) translateY(0)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 3,
  animation: `floatingScorePill 1240ms ease-out ${animationDelay}ms forwards`,
  '@keyframes floatingScorePill': {
    '0%': {
      opacity: 0,
      transform: 'translateX(-50%) translateY(0)',
    },
    '16%': {
      opacity: 1,
      transform: 'translateX(-50%) translateY(0)',
    },
    '100%': {
      opacity: 0,
      transform: 'translateX(-50%) translateY(44px)',
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
  animationDelay = 0,
}: ScoreIndicatorProps) {
  const [displayedScore, setDisplayedScore] = useState(score);

  const handleAnimationEnd = () => {
    if (newPoints && newPoints > 0) {
      setDisplayedScore(score + newPoints);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {newPoints && newPoints > 0 ? (
        <FloatingPill
          animationDelay={animationDelay}
          onAnimationEnd={handleAnimationEnd}
        >
          <Typography variant="h2">+{newPoints}</Typography>
        </FloatingPill>
      ) : null}
      <ScorePill>
        <Typography data-testid="scoreindicator-newpoints" variant="h2">
          {isNullOrUndefined(displayedScore) ? 0 : displayedScore}
        </Typography>
      </ScorePill>
    </Box>
  );
}
