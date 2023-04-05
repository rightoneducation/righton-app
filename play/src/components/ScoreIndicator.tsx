import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { isNullOrUndefined } from '@righton/networking';

const useStyles = makeStyles(() => ({
  newPointsAnimation: {
    animation: `$newScoreUp 750ms cubic-bezier(0.4, 0, 0.2, 1)`,
    opacity: 0,
    position: 'absolute', // float new points pill above rest of content
  },
  '@keyframes newScoreUp': {
    '0%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(-110%)',
    },
  },
  newPointsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `58px`,
    height: '22px',
    borderRadius: '23px',
    background: 'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)',
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `58px`,
    height: '22px',
    borderRadius: '23px',
    background: 'linear-gradient(190deg, #73B6F0 0%, #057BE3 80%)',
  },
  text: {
    fontFamily: 'Karla',
    fontSize: '18px',
    fontWeight: 800,
    lineHeight: '21px',
    color: '#FFFFFF',
    textShadow: '0px 1px 1px rgba(0, 0, 0, 0.15)',
  },
}));

interface ScoreIndicatorProps {
  newPoints: number;
  score: number | null;
}

export default function ScoreIndicator({
  newPoints,
  score,
}: ScoreIndicatorProps) {
  const classes = useStyles();
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
  });

  return (
    <>
      <div id="newPointsAnimation" className={classes.newPointsAnimation}>
        {newPoints && newPoints > 0 ? (
          <div className={classes.newPointsContainer}>
            <Typography className={classes.text}>
              {' '}
              {`+${newPoints}`}{' '}
            </Typography>
          </div>
        ) : null}
      </div>
      <div className={classes.scoreContainer}>
        <Typography className={classes.text}>
          {' '}
          {isNullOrUndefined(currentScore) ? 0 : currentScore}{' '}
        </Typography>
      </div>
    </>
  );
}
