import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card
} from "@material-ui/core";
import ConfidenceResponseGraph from "../components/ConfidenceResponseGraph";

export default function GameAnswersDropdown({ }) {
  const classes = useStyles();

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
    margin: "12px"
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
}));