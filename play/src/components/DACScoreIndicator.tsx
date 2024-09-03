import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
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

const NewPointsPill = styled(ScorePill)(({ theme }) => ({
  background: `${theme.palette.primary.altHighlightGradient}`,
  zIndex: 2,
}));

interface NewPointsAnimationProps {
  isSmallScreen: boolean;
}

const NewPointsAnimation =  styled('div', {
  shouldForwardProp: (prop) => prop !== 'isSmallScreen',
})<NewPointsAnimationProps>(({ isSmallScreen }) => ({
  opacity: 0,
  position: 'absolute',
  zIndex: 2,
  paddingLeft: !isSmallScreen ? '8px' : '0px',
  right: !isSmallScreen ? '0px' : '58px',
  animation: `
   newScoreUpWiggle 1500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
   newScoreUpBounce 300ms ease-in-out 1500ms, 
   newScoreUpFadeDown 1000ms ease-in-out 1800ms
  `,
  '@keyframes newScoreUpWiggle': {
    '0%': {
      transform: 'translateY(-110%) rotate(0deg) scale(1.0)',
    },
    '10%': {
      opacity: 1,
      transform: 'translateY(-110%) rotate(0deg) scale(1.2)',
    },
    '15%, 45%, 75%': {
      opacity: 1,
      transform: 'translateY(-110%) rotate(-12deg) scale(1.2)',
    },
    '30%, 60%': {
      opacity: 1,
      transform: 'translateY(-110%) rotate(12deg) scale(1.2)',
    },
    '90%': {
      opacity: 1,
      transform: 'translateY(-110%) rotate(0deg) scale(1.2)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(-110%) rotate(0deg) scale(1.0)',
    },
  },
  '@keyframes newScoreUpBounce': {
    '0%, 100%': {
      opacity: 1,
      transform: 'translateY(-110%)',
    },
    '50%': {
      opacity: 1,
      transform: 'translateY(-130%)',
    },
  },
  '@keyframes newScoreUpFadeDown': {
    '0%': {
      opacity: 1,
      transform: 'translateY(-110%)',
    },
    '100%': {
      transform: 'translateY(0%)',
    },
  },
}));

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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
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
    <Box style={{height: '22px'}}>
      {newPoints && newPoints > 0 ? (
        <NewPointsAnimation onAnimationEnd={handlePointsAnimationEnd} isSmallScreen={isSmallScreen}>
          <NewPointsPill>
            <Typography variant="overline">{`+${newPoints}`}</Typography>
          </NewPointsPill>
        </NewPointsAnimation>
      ) : null}
    </Box>
  );
}
