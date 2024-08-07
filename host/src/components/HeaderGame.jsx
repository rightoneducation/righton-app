import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Pagination from './Pagination';
import Timer from './Timer';

const useStyles = makeStyles(() => ({
  div: {
    top: 0,
    padding: '16px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '700px',
    zIndex: 1,
  },
  title: {
    fontWeight: 700,
    fontSize: '36px',
    lineHeight: '54px',
    color: 'white',
  },
  phases: {
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: 'white',
  },
  roundedItem: {
    background: 'red',
  },
  ul: {
    '& .MuiPaginationItem-page.Mui-selected': {
      backgroundColor: 'white',
      color: 'rgba(56, 68, 102, 1)',
      border: 'white solid 3px',
      borderRadius: '3px',
    },
    '& .MuiPaginationItem-root': {
      color: 'rgba(255,255,255, 0.5)',
      border: 'rgba(255,255,255, 0.5) solid 3px',
      borderRadius: '3px',
      paddingLeft: '15px',
      paddingRight: '15px',
      opacity: '1',
      cursor: 'default',
      pointerEvents: 'none',
    },
  },
}));

const label = {
  1: 'Preparing Questions',
  2: 'Phase 1 of 2 - Choose Correct Answer',
  3: 'Phase 1 of 2 - View and Discuss Results',
  4: 'Phase 1 of 2 - Results',
  5: 'Phase 2 of 2 - Instructions',
  6: 'Phase 2 of 2 - Choose Trickiest Answer',
  7: 'Phase 2 of 2 - View and Discuss Results',
  8: 'Phase 2 of 2 - Results',
  9: 'Proceed to RightOn Central',
};

export default function HeaderGame({
  totalQuestions,
  currentQuestionIndex,
  statePosition,
  headerGameCurrentTime,
  totalRoundTime,
  gameTimer,
  handleTimerIsFinished
}) {
  const classes = useStyles();

  const divStyle = {
    height: statePosition === 1 ? 'auto' : '175px'
  };
  
  return (
    <div style={divStyle} className={classes.div}>
      {statePosition !== 1 && ( 
        <Pagination
          totalQuestions={totalQuestions}
          currentQuestionIndex={currentQuestionIndex}
          statePosition={statePosition}
        />
      )}
      <Typography className={classes.title}>
        {statePosition !== 1 ? `Question ${currentQuestionIndex + 1} of ${totalQuestions}`
          : currentQuestionIndex === 0
            ? 'Game Configurations'
            : 'Leaderboard'
        }
      </Typography>
      { (statePosition !== 1) && 
        <>
          <Typography className={classes.phases}>{label[statePosition]}</Typography>
          <div style={{ opacity: gameTimer ? '1' : '0.4' }}>
            <Timer
              headerGameCurrentTime={headerGameCurrentTime}
              isFinished={!gameTimer}
              isPaused={!gameTimer}
              totalRoundTime={totalRoundTime}
              handleTimerIsFinished={handleTimerIsFinished}
            />
          </div>
        </>
      }
    </div>
  );
}
