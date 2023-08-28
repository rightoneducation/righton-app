import React from 'react';
import {
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import ResponsesGraph from './ResponsesGraph';

export default function Responses({ 
  data, 
  numPlayers, 
  totalAnswers, 
  questionChoices, 
  statePosition, 
  teamsPickedChoices, 
  graphClickInfo, 
  setGraphClickInfo 
}) {
  const classes = useStyles();

  return (
    <Box className={classes.centerContent}>
        <Typography className={classes.titleStyle}>Real-time Responses</Typography>
        <ResponsesGraph 
          data={data} 
          numPlayers={numPlayers} 
          totalAnswers={totalAnswers} 
          questionChoices={questionChoices} 
          statePosition={statePosition} 
          teamsPickedChoices={teamsPickedChoices} 
          graphClickInfo={graphClickInfo} 
          setGraphClickInfo={setGraphClickInfo}
        />
    </Box>
  );
}

const useStyles = makeStyles({
  centerContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: '100%',
    maxWidth: "500px"
  },
  titleStyle: {
    color: "var(--teacher-element-foreground, #FFF)",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    textTransform: "none",
    textAlign: "left",
  },
});
