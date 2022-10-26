import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
  LinearProgress,
  Box
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

export default function GameAnswersDropdown({ answer, explanation, correct, numQuestionAnswers, totalAnswers, pos }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const letterDictionary = {
    0:'A. ',
    1:'B. ',
    2:'C. ',
    3:'D. ',
    4:'E. ',
    5:'F. ',
    6:'G. ',
    7:'H. ',
    8:'I. '
  }
  return (
    <Grid className={classes.choices}>
      <Card
        className={correct ? classes.rightAnswer : classes.wrongAnswer}
        onClick={() => setExpanded(!expanded)}
      >
        <Box className={classes.answerBox}>
          <CardContent className={classes.cardContent}>
            <Box className={correct ? classes.answerBoxRight : classes.answerBoxWrong}>
              <Typography className={classes.answerText}>{letterDictionary[pos] + answer}</Typography>
              <IconButton
                size="small"
                className={expanded ? classes.expanded : classes.expand}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((numQuestionAnswers/totalAnswers)*100)}
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary
              }}
            />
          </CardContent>
          <Collapse in={expanded}>
            <CardContent className={classes.dropdownContent}>
              <Typography className={classes.explanationTitle}>
                {correct ? "Correct Answer Explanation" : "Wrong Answer Explanation"}
              </Typography>
              <Typography className={classes.explanationText}>
                {explanation}
              </Typography>
            </CardContent>
          </Collapse>
        </Box>
        <CardContent className={expanded ? classes.expandedBox : classes.expandBox}>
          <Box className={correct ? classes.numAnsweredBoxRight : classes.numAnsweredBoxWrong}>
            <Typography className={classes.numAnsweredText}> {numQuestionAnswers ? numQuestionAnswers : 0}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  choices: {
    display: "flex",
    justifyContent: "center"
  },
  rightAnswer: {
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    width: "75%",
    boxShadow: "none",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "row"
  },
  wrongAnswer: {
    background: "transparent",
    borderRadius: "12px",
    width: "75%",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "none",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "row"
  },
  answerText: {
    fontFamily: 'Poppins',
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "18px",
    lineHeight: "27px",
    color: "#FFFFFF"
  },
  numAnsweredText: {
    fontFamily: 'Poppins',
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "27px",
    color: "#FFFFFF",
    padding: "0px 5px"
  },
  answerBox: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    padding: "8px"
  },
  answerBoxRight: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "2px"
  },
  answerBoxWrong: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  dropdownContent: {
    width: "115%",
    padding: "10px 5px 5px 0px !important"
  },
  expand: {
    display: "flex",
    float: "right",
    color: "white",
    transform: "rotate(270deg)",
    padding: "0px",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expanded: {
    float: "right",
    color: "white",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  colorPrimary: {
    backgroundColor: "rgba(158, 195, 255, 0.2)",
    width: "100%"
  },
  barColorPrimary: {
    backgroundColor: "white",
    width: "100%"
  },
  colorPrimary: {
    backgroundColor: "rgba(158, 195, 255, 0.2)",
    width: "100%"
  },
  barColorPrimary: {
    backgroundColor: "white",
    width: "100%"
  },
  expand: {
    display: "flex",
    float: "right",
    color: "white",
    transform: "rotate(270deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expanded: {
    float: "right",
    color: "white",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  cardContent: {
    padding: "0px"
  },
  explanationTitle: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "16px",
    lineHeight: "24px",
    color: "#FFFFFF"
  },
  explanationText: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "18px",
    color: "#FFFFFF"
  },
  expandedBox: {
    display: "none"
  },
  expandBox: {
    display: "block",
    width: "20%",
    height: "100%",
    padding: "0px !important"
  },
  numAnsweredBoxRight: {
    width: "100%",
    height: "100%",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "0px !important"
  },
  numAnsweredBoxWrong: {
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "0px !important"
  },
  /*colorPrimary: {
    backgroundColor: "rgba(158, 195, 255, 0.2)",
    width: "100%"
  },
  barColorPrimary: {
    backgroundColor: "white",
    width: "100%"
  },
  card: {
    display: "flex",
    flexDirection: "row",
    borderRadius: "10px",
    backgroundColor: "rgba(158, 195, 255, 0.2)",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10px",
    width: "80%",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    position: "relative"
  },
  correctCard: {
    display: "flex",
    flexDirection: "row",
    borderRadius: "10px",
    backgroundColor: "rgba(124, 251, 113, 0.5)",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10px",
    width: "80%",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    position: "relative"
  },
  cardAnswers: {
    fontWeight: 500,
    color: "white",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto"
  },
  answer: {
    fontWeight: 600,
    color: "white",
    fontSize: "17px",
    display: "inline",
    flexDirection: "row"
  },
  expand: {
    display: "flex",
    float: "right",
    color: "white",
    transform: "rotate(270deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expanded: {
    float: "right",
    color: "white",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  explanationTitle: {
    fontWeight: 700,
    fontSize: "20px",
    color: "white"
  },
  explanationText: {
    fontWeight: 600,
    fontSize: "14px",
    color: "white"
  }*/
}));
