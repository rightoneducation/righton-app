import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card
} from "@material-ui/core";
import ConfidenceResponseGraph from "../components/ConfidenceResponseGraph";
import ConfidenceResponseDropdown from "./ConfidenceResponseDropdown";

export default function GameAnswersDropdown({ }) {
  const classes = useStyles();
  const [selectedResponse, setSelectedResponse] = useState(true);
  const option = "Quite";

  return (
    <Grid className={classes.cardContainer}>
      <Card className={classes.responseCard}>
        <Typography className={classes.headerText}>
          Confidence
        </Typography>
        <Typography className={classes.infoText}>
          Players are asked how sure they are of their answer for this question.
        </Typography>
        <ConfidenceResponseGraph></ConfidenceResponseGraph>
        {!selectedResponse ?
          <Typography className={classes.hintText}>
            Tap on a response to see more details.
          </Typography> :
          <Grid className={classes.responsesContainer}>
            <Typography className={classes.answerOptionText}>
              Showing players who answered:
            </Typography>
            <Typography className={classes.responseHeader}>{option} Confident</Typography>
            <Grid className={classes.answerHeaderContainer}><Typography className={classes.answerHeader}>Answer</Typography></Grid>
            <ConfidenceResponseDropdown></ConfidenceResponseDropdown>
          </Grid>
        }
      </Card>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  cardContainer: {
    display: "flex",
    padding: "16px 12px",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
    margin: "12px",
    maxWidth: "350px"
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