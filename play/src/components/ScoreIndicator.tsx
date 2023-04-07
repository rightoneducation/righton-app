import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Typography, Container } from '@mui/material';
import { isNullOrUndefined } from '@righton/networking';

const ScoreContainer = styled(Container)(
  ({theme}) => ({
   position: 'relative',
  })
);

const NewPointsPill = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: `58px`,
  height: '22px',
  borderRadius: '23px',
  background: 'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)',
});

const ScorePill = styled(NewPointsPill)({
  position: 'absolute',
  right: '0',
  background: 'linear-gradient(190deg, #73B6F0 0%, #057BE3 80%)',
  zIndex: 1,
});

const NewPointsAnimation = styled('div')({
  animation: `newScoreUp 1000ms cubic-bezier(0.4, 0, 0.2, 1)`,
  opacity: 0,
  position: 'absolute',
  right: '0',
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
  newPoints: number;
  score: number | null;
}

export default function ScoreIndicator({
  newPoints,
  score,
}: ScoreIndicatorProps) {
  const [currentScore, setCurrentScore] = useState(
    isNullOrUndefined(score) ? 0 : score
  );

  // adds an eventLister to add the new points to the existing score when the animation completes
  useEffect(() => {
    const element = document.getElementById('newPointsAnimation');
    const handleAnimationEnd = () => {
      setCurrentScore((prevScore) => prevScore + newPoints);
    };
    element?.addEventListener('animationend', handleAnimationEnd);
    return () => {
      element?.removeEventListener('animationend', handleAnimationEnd);
    };
  },[newPoints]);

  return (
    <ScoreContainer>
      <NewPointsAnimation id="newPointsAnimation" >
        {newPoints && newPoints > 0 ? (
          <NewPointsPill>
            <Typography variant='overline'>{`+${newPoints}`}</Typography>
          </NewPointsPill>
        ) : null}
      </NewPointsAnimation>
      <ScorePill >
        <Typography variant='overline'>
          {isNullOrUndefined(currentScore) ? 0 : currentScore}
        </Typography>
      </ScorePill>
    </ScoreContainer>
  );
}
