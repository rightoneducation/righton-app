import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import PlayerThinkingGraph from './PlayerThinkingGraph';

export default function PlayerThinking({
  data,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}) {
  const classes = useStyles();
  return (
    <Box className={classes.centerContent}>
      <Typography className={classes.titleStyle}>
        Player Thinking
      </Typography>
      <Typography className={classes.infoText}>
        Players are asked how sure they are of their answer for this question.
      </Typography>
      <PlayerThinkingGraph
        data={data}
        numPlayers={numPlayers}
        totalAnswers={totalAnswers}
        questionChoices={questionChoices}
        statePosition={statePosition}
        graphClickInfo={graphClickInfo}
        isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
        handleGraphClick={handleGraphClick}
      />
      {graphClickInfo.graph === null ? (
        <Typography className={classes.subText}>
          Tap on a response to see more details.
        </Typography>
      ) : null}
    </Box>
  );
}

const useStyles = makeStyles({
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  titleStyle: {
    color: 'var(--teacher-element-foreground, #FFF)',
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    textTransform: 'none',
    textAlign: 'left',
  },
  infoText: {
    color: '#FFF',
    alignSelf: 'stretch',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
});
