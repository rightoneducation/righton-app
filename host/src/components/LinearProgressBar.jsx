import React from 'react';
import { makeStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function LinearProgressBar({ inputNum, totalNum }) {
  const classes = useStyles();
  const progressPercent =
    (inputNum !== 0 && inputNum > totalNum) ? (inputNum / totalNum) * 100 : 0;

  return (
    <div className={classes.bargroup}>
      <div className={classes.barContainer}>
        <LinearProgress
          variant="determinate"
          classes={{
            colorPrimary: classes.colorPrimary,
            barColorPrimary: classes.barColorPrimary,
          }}
          className={classes.progressBar}
          value={progressPercent}
        ></LinearProgress>
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '5px',
            width: `${progressPercent - 2}%`,
            textAlign: 'right',
            fontFamily: 'Helvetica',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: '1',
            lineHeight: '18px',
          }}
        >
          {inputNum}
        </div>
      </div>
      <div className={classes.totalNum}>{totalNum}</div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  bargroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: '10px',
    width: '100%',
  },
  totalNum: {
    fontSize: '12px',
    lineHeight: '12px',
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    margin: 'auto',
  },
  barContainer: {
    position: 'relative',
    width: '100%',
  },
  progressBar: {
    position: 'relative',
    top: '0',
    left: '0',
    height: '18px',
    width: '100%',
    borderRadius: '3px',
  },
  colorPrimary: {
    background: 'rgba(255,255,255,0.2)',
  },
  barColorPrimary: {
    background: 'white',
  },
}));
