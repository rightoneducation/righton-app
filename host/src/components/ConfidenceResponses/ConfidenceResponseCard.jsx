import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card
} from "@material-ui/core";
import ConfidenceResponseGraph from "./ConfidenceResponseGraph";
import ConfidenceResponseDropdown from "./ConfidenceResponseDropdown";
import { ConfidenceLevel, isNullOrUndefined } from "@righton/networking";

export default function ConfidenceResponseCard({ responses, orderedAnswers, graphClickInfo, setGraphClickInfo }) {
  const classes = useStyles();
  const [selectedBarValue, setSelectedBarValue] = useState(null);

 

  return (
    <Grid className={classes.centerContent}>
      <Grid className={classes.cardContainer}>
        <Typography className={classes.headerText}>
          Confidence
        </Typography>
        <Typography className={classes.infoText}>
          Players are asked how sure they are of their answer for this question.
        </Typography>
        <Grid className={classes.graphContainer}>
          <ConfidenceResponseGraph responses={responses} graphClickInfo={graphClickInfo} setGraphClickInfo={setGraphClickInfo}></ConfidenceResponseGraph>
        </Grid>
        {isNullOrUndefined(selectedBarValue) ?
          <Typography className={classes.hintText}>
            Tap on a response to see more details.
          </Typography> 
          : null
        }
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  centerContent: {
    display: "flex",
    justifyContent: "center",
  },
  cardContainer: {
    display: "flex",
    padding: "16px 12px",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
    margin: "12px",
    maxWidth: "700px",
    justifyContent: "center",
  },
  responseCard: {
    display: "flex",
    padding: "16px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "16px",
    alignSelf: "stretch",
    borderRadius: "24px",
    background: "#08458F",
    boxShadow: "0px 8px 16px -4px rgba(92, 118, 145, 0.40)"
  },
  headerText: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal"
  },
  infoText: {
    color: "#FFF",
    alignSelf: "stretch",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal"
  },
  graphContainer: {
    display: "flex",
    padding: "5px 4px",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch"
  },
  hintText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    opacity: 0.6,
    alignSelf: "stretch"
  },
  answerOptionText: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal"
  },
  responseHeader: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal"
  },
  responsesContainer: {
    display: "flex",
    padding: "16px 0px",
    flexDirection: "column",
    alignItems: "flexEnd",
    gap: "7px",
    alignSelf: "stretch"
  },
  answerHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  answerHeader: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    opacity: 0.4,
  }
}));