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
    maxWidth: "500px",
    margin: "0 auto", 
    width: "100%"
  },
});

export default function Responses({ questions, teams, studentResponses, numPlayers, totalAnswers, questionChoices, statePosition,teamsPickedChoices }) {
  const classes = useStyles();

  return (
    <Grid className={classes.centerContent}>
        <Typography className={classes.titleStyle}>Real-time Responses</Typography>
        <ResponsesGraph questions={questions} teams={teams} studentResponses={studentResponses} numPlayers={numPlayers} totalAnswers={totalAnswers} questionChoices={questionChoices} statePosition={statePosition} teamsPickedChoices={teamsPickedChoices}/>
    </Grid>
  );
}
