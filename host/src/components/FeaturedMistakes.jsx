import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper, Typography } from "@material-ui/core";
import GameAnswersDropdown from "./GameAnswersDropdown";
import { isNullOrUndefined } from "@righton/networking";

export default function GameAnswers() {
  const classes = useStyles();
  return(
    <Paper className={classes.background} elevation={10}>
      <Box>
        <Typography className={classes.title}>Featured Mistakes</Typography>
        <Typography className={classes.subtitle}>Selected responses will be presented to players as options for popular incorrect answers.</Typography>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles(theme => ({
  background: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    padding: `16px`,
    backgroundColor: '#08458F', 
    boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Rubik',
    textAlign: 'left',
    fontSize: '24px',
    fontWeight: 500,
    marginBottom: '10px',
  },
  subtitle: {
    color: '#FFFFFF',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: 400,
  }
}));
