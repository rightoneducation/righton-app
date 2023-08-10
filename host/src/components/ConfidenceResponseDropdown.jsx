import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card
} from "@material-ui/core";
import check from '../images/correctAnswerCheck.png';

export default function ConfidenceResponseDropdown({ responses }) {
  const useStyles = makeStyles(theme => ({
    container: {
      display: "flex",
      paddingBottom: "16px",
      flexDirection: "column",
      alignItems: "flexEnd",
      gap: "7px",
      alignSelf: "stretch"
    },
    playerCard: {
      display: "flex",
      padding: "8px 12px",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      alignSelf: "stretch",
      borderRadius: "8px",
      background: "#063772"
    },
    nameText: {
      overflow: "hidden",
      color: "#FFF",
      textOverflow: "ellipsis",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "normal"
    },
    answerDataContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center"
    },
    answerText: {
      fontSize: "16px",
      color: "#FFF",
      fontWeight: 800
    },
    check: {
      width: 18,
      height: 24
    }
  }));
  const classes = useStyles();

  // TODO: delete this later
  const optionResponses = [
    { name: 'Alex Williams', answer: 'C', correct: true },
    { name: 'Alessandro DeLuca-Smith', answer: 'C', correct: true },
    { name: 'Jackson Cameron', answer: 'C', correct: true },
    { name: 'Jeremiah Tanaka', answer: 'C', correct: true },
    { name: 'Kyle Bradshaw', answer: 'C', correct: true },
    { name: 'Shana Quintero', answer: 'C', correct: true },
    { name: 'Vanessa Martinez', answer: 'D', correct: false },
    { name: 'Vanessa Montenegro-Rodriguez', answer: 'D', correct: false },
    { name: 'Xiomara Jimenez', answer: 'B', correct: false },
    { name: 'Zander Lee', answer: 'A', correct: false }
  ];

  // TODO: sort the response array by answer correctness + popularity
  const playerResponse = ({ name, answerChoice, correct }) => {
    return (
      <Card className={classes.playerCard}>
        <Typography className={classes.nameText}>{name}</Typography>
        <Grid className={classes.answerDataContainer}>
          {correct && <img src={check} className={classes.check} />}
          <Typography className={classes.answerText}>{answerChoice}</Typography>
        </Grid>
      </Card>
    );
  }

  return (
    <Grid className={classes.container}>
      {responses.map((playerData) => playerResponse(playerData))}
    </Grid>
  );
};