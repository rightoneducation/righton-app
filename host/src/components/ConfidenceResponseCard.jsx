import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card
} from "@material-ui/core";
import ConfidenceResponseGraph from "../components/ConfidenceResponseGraph";
import ConfidenceResponseDropdown from "./ConfidenceResponseDropdown";
import { ConfidenceLevel, isNullOrUndefined } from "@righton/networking";

export default function ConfidenceResponseCard({ responses, orderedAnswers }) {
  const classes = useStyles();
  const [selectedBarValue, setSelectedBarValue] = useState(null);

  const headerTranslation = (option) => {
    switch (option) {
      case ConfidenceLevel.NOT_RATED:
        // TODO: (DESIGN COORD) should confirm with design what this message should be
        return "No response";
      case ConfidenceLevel.NOT_AT_ALL:
        return "Not at all confident";
      case ConfidenceLevel.KINDA:
        return "Kinda confident";
      case ConfidenceLevel.QUITE:
        return "Quite confident";
      case ConfidenceLevel.VERY:
        return "Very confident";
      case ConfidenceLevel.TOTALLY:
        return "Totally confident";
    }
  }
  // TODO: (DESIGN COORD) What should be displayed when there are 0 players who chose the selected response?
  return (
    <Grid className={classes.cardContainer}>
      <Typography className={classes.headerText}>
        Confidence
      </Typography>
      <Typography className={classes.infoText}>
        Players are asked how sure they are of their answer for this question.
      </Typography>
      <Grid className={classes.graphContainer}>
        <ConfidenceResponseGraph responses={responses} selectedBarValue={selectedBarValue} setSelectedBarValue={setSelectedBarValue}></ConfidenceResponseGraph>
      </Grid>
      {isNullOrUndefined(selectedBarValue) ?
        <Typography className={classes.hintText}>
          Tap on a response to see more details.
        </Typography> :
        <Grid className={classes.responsesContainer}>
          <Typography className={classes.answerOptionText}>
            Showing players who answered:
          </Typography>
          <Typography className={classes.responseHeader}>{headerTranslation(selectedBarValue)}</Typography>
          <Grid className={classes.answerHeaderContainer}><Typography className={classes.answerHeader}>Answer</Typography></Grid>
          <ConfidenceResponseDropdown responses={responses[selectedBarValue]} orderedAnswers={orderedAnswers}></ConfidenceResponseDropdown>
        </Grid>
      }
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