import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

export default function Pagination({
  totalQuestions,
  currentQuestionIndex,
  statePosition,
}) {
  const classes = useStyles();
  const paginationItem = (index) => {
    if (index < currentQuestionIndex) return classes.playedQuestionBox;
    if (index > currentQuestionIndex) return classes.unplayedQuestionBox;
    if (statePosition < 5) return classes.currentQuestionBoxPhase1;
    return classes.currentQuestionBoxPhase2;
  };

  return (
    <Box className={classes.container}>
      {Array.from({ length: totalQuestions }).map((_, index) => (
        <Box className={paginationItem(index)}> {index + 1} </Box>
      ))}
    </Box>
  );
}

const basePaginationStyle = {
  width: '32px',
  height: '18px',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'rgba(255,255,255,0.2)',
  boxSizing: 'border-box',
};
const currentPaginationStyle = {
  ...basePaginationStyle,
  background:
    'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)',
  border: '1px solid rgba(255,255,255,1)',
  justifyContent: 'flex-start',
  width: '64px',
  paddingLeft: '4px',
  color: '#384466',
};

const useStyles = makeStyles({
  basePaginationStyle,
  currentPaginationStyle,
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '4px',
  },
  playedQuestionBox: {
    ...basePaginationStyle,
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0)',
  },
  unplayedQuestionBox: {
    ...basePaginationStyle,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  currentQuestionBoxPhase1: {
    ...currentPaginationStyle,
  },
  currentQuestionBoxPhase2: {
    ...currentPaginationStyle,
    background: '#FFF',
  },
});
