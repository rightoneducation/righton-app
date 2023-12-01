import React, {useState} from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { isNullOrUndefined } from '@righton/networking';
import PlayerThinkingGraph from './PlayerThinkingGraph';

export default function PlayerThinking({
  hints,
  gptHints,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
  handleProcessHintsClick,
  hintsError
}) {
  const classes = useStyles();
  return (
    <Box className={classes.centerContent}>
      <Box style={{display: 'flex', aligntItems: 'center', justifyContent: 'space-between', width: '100%'}}>
        <Typography className={classes.titleStyle}>
          Player Thinking
        </Typography>
      </Box>
      <Typography className={classes.infoText}>
        Players have optionally submitted hints to help other players.
      </Typography>
      { !isNullOrUndefined(gptHints)? 
        <>
          <PlayerThinkingGraph
            data={gptHints}
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
        </>
      : 
      <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16}}>
        <Typography className={classes.infoText}>
        {hints.length} / {numPlayers} players have submitted a hint
        </Typography>
          <Button
          className={classes.button}
          disabled={hints.length < 2}
          onClick={() => handleProcessHintsClick(hints)}
        >
          Process Hints
        </Button>
        { hints.length <= 2 &&
          <Typography className={classes.subText}>
            At least 2 players must submit a hint to process them
          </Typography>
        } 
        { hintsError &&
          <Typography className={classes.subText}>
            There was an error processing the hints. Please try again.
          </Typography>
        } 
       </Box>
      }
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
    boxSizing: 'border-box',
    gap: 16
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
  button: {
    border: '4px solid #159EFA',
    background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
    borderRadius: '34px',
    width: '150px',
    height: '24px',
    color: 'white',
    fontSize: '15px',
    bottom: '0',
    fontWeight: '700',
    lineHeight: '30px',
    textTransform: 'none',
    '&:disabled': {
      background: `#909090`,
      color: '#FFF',
      boxShadow: 'none',
      border: '4px solid #909090',
      '&:hover': {
        background: `#909090`,
      },
    }
  },
});
