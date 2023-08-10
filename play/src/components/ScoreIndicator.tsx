import React, { useEffect, useState } from 'react';
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


const ScoreAnimation = styled('div')({
  opacity: 1,
  position: 'absolute',
  zIndex: 2,
  animation: `
   scoreGrow 1000ms ease-in-out 0ms,
  `,
  '@keyframes scoreGrow': {
      '0%': { 
        opacity: 1,
        transform: 'scale(1.0)' 
      },
      '100%': { 
        opacity: 1,
        transform: 'scale(1.2)' 
      },
    },
});

// const NewPointsPill = styled(ScorePill)(({ theme }) => ({
//   background: `${theme.palette.primary.altHighlightGradient}`,
//   zIndex: 2,
// }));

// const NewPointsAnimation = styled('div')({
//   opacity: 0,
//   position: 'absolute',
//   zIndex: 2,
//   animation: `
//    newScoreUpWiggle 1500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
//    newScoreUpBounce 300ms ease-in-out 1500ms, 
//    newScoreUpFadeDown 1000ms ease-in-out 1800ms
//   `,
//   '@keyframes newScoreUpWiggle': {
//       '0%': { 
//         transform: 'translateY(-110%) rotate(0deg) scale(1.0)' 
//       },
//       '10%': { 
//         opacity: 1, 
//         transform: 'translateY(-110%) rotate(0deg) scale(1.2)' 
//       },
//       '15%, 45%, 75%': { 
//         opacity: 1, 
//         transform: 'translateY(-110%) rotate(-12deg) scale(1.2)' 
//       },
//       '30%, 60%': { 
//         opacity: 1, 
//         transform: 'translateY(-110%) rotate(12deg) scale(1.2)' 
//       },
//       '90%': { 
//         opacity: 1, 
//         transform: 'translateY(-110%) rotate(0deg) scale(1.2)' 
//       },
//       '100%': { 
//         opacity: 1, 
//         transform: 'translateY(-110%) rotate(0deg) scale(1.0)' 
//       },
//     },
//     '@keyframes newScoreUpBounce': {
//       '0%, 100%': {
//         opacity: 1, 
//         transform: 'translateY(-110%)' 
//       },
//       '50%': {
//         opacity: 1, 
//         transform: 'translateY(-130%)' 
//       },
//     },
//     '@keyframes newScoreUpFadeDown': {
//       '0%': {
//         opacity: 1, 
//         transform: 'translateY(-110%)' 
//       },
//       '100%': { 
//         transform: 'translateY(0%)' 
//       },
//     },
// });

interface ScoreIndicatorProps {
  newPoints?: number;
  score: number;
}

export default function ScoreIndicator({
  newPoints,
  score,
}: ScoreIndicatorProps) {
  const [newScore, setNewScore] = useState(score);
  // adds an eventLister to add the new points to the existing score when the animation completes
  useEffect(() => {
    const element = document.getElementById('scoreAnimation');
    const handleAnimationEnd = () => {
      if (newPoints && newPoints > 0) {
        setNewScore(score + newPoints);
      }
    };
    element?.addEventListener('animationend', handleAnimationEnd);
    return () => {
      element?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [newPoints]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {/* <NewPointsAnimation id="newPointsAnimation">
        {newPoints && newPoints > 0 ? (
          <NewPointsPill>
            <Typography variant="overline">{`+${newPoints}`}</Typography>
          </NewPointsPill>
        ) : null}
      </NewPointsAnimation>  */}
      <ScoreAnimation id="scoreAnimation">
        <ScorePill>
          <Typography data-testid="scoreindicator-newpoints" variant="overline">
            {isNullOrUndefined(newScore) ? 0 : newScore}
          </Typography>
        </ScorePill>
      </ScoreAnimation>
    </Box>
  );
}
