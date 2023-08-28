import React from 'react';
import { Typography, makeStyles, Switch, Paper } from '@material-ui/core';

export default function ResponsesGraph ({ 
  isConfidenceEnabled,
  handleConfidenceSwitchChange
}) {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>
          Confidence
        </Typography>
        <Switch className={classes.switch} checked={isConfidenceEnabled} onChange={handleConfidenceSwitchChange}/>
      </div>
      <div className={classes.answerContainer}>
        <Typography className={classes.text}>
          You may allow players to indicate how sure they are of their answer.
        </Typography>
 
      </div>
    </Paper>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    padding: `16px`,
    backgroundColor: '#1D448A',
    width: "311px", // hardcoded to match GameCard width
    gap: '16px',
    boxSizing: 'border-box'
  },
  title: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    textTransform: "none",
  },
  titleContainer: {
    marginTop: '3%',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400'
  },
  answerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  switch: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#3874CB',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#3874CB',
    },
  }
});