import React from 'react';
import { Typography, makeStyles, Switch, Box } from '@material-ui/core';

export default function EnableSurfacingThinking({
  isSurfacingThinkingEnabled,
  handleSurfacingThinkingChange,
}) {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>Player Thinking</Typography>
        <Switch
          className={classes.switch}
          checked={isSurfacingThinkingEnabled}
          onChange={handleSurfacingThinkingChange}
        />
      </div>
      <div className={classes.answerContainer}>
        <Typography className={classes.text}>
         Players are asked to provide a hint to help others who made the selected mistake.
        </Typography>
      </div>
    </Box>
  );
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    //padding: `16px`,
    backgroundColor: 'rgba(0,0,0,0)', // this will be converted to Paper with background color for host 2.0
    width: '100%', // hardcoded to match GameCard width
    gap: '16px',
    boxSizing: 'border-box',
    elevation: 0,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    textTransform: 'none',
  },
  titleContainer: {
    marginTop: '3%',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
  answerContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  switch: {
    '& .MuiSwitch-switchBase': {
      color: "#C0C0C0"
    },
    '& .MuiSwitch-track': {
      backgroundColor: "#EAEAEA",
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#FFFFFF',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#111111',
    },
  },
});
