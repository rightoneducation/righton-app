import React from 'react';
import {
    Grid,
    Typography,
  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import ResponsesGraph from './ResponsesGraph';

const useStyles = makeStyles({
  titleStyle: {
    color: "var(--teacher-element-foreground, #FFF)",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    textTransform: "none", 
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
    width: '95%',
    margin: 'auto',
    padding: "20px 40px",
  },
});

export default function Responses({studentResponses, numPlayers, totalAnswers, questionChoices, statePosition}) {
  const classes = useStyles();
 
  return (
    <Grid container className={classes.centerContent}>
        <Grid container className={classes.titleContainer}>
            <Typography className={classes.titleStyle}>Real-time Responses</Typography>
            <ResponsesGraph studentResponses={studentResponses} numPlayers={numPlayers} totalAnswers={totalAnswers} questionChoices={questionChoices} statePosition={statePosition}/>
        </Grid>
    </Grid>
  );
}
