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

export default function HostAnswerDropdown({ answer, explanation, correct }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid className={classes.choices}>
      <Card
        className={correct ? classes.rightAnswer : classes.wrongAnswer}
        onClick={() => setExpanded(!expanded)}
      >
        <Box className={classes.answerBox}>
          <CardContent className={classes.cardContent}>
            <Box className={correct ? classes.answerBoxRight : classes.answerBoxWrong}>
              <Typography className={classes.answerText}>ek</Typography>
              <IconButton
                size="small"
                className={expanded ? classes.expanded : classes.expand}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary
              }}
            />
          </CardContent>
          <Collapse in={expanded}>
            <CardContent>
              <Typography className={classes.explanationTitle}>
                {correct ? "Correct Answer Explanation" : "Wrong Answer Explanation"}
              </Typography>
              <Typography className={classes.explanationText}>
                {explanation}
              </Typography>
            </CardContent>
          </Collapse>
        </Box>
        <Box className={correct ? classes.numAnsweredBoxRight : classes.numAnsweredBoxWrong}>
          <Typography className={classes.numAnsweredText}>kw</Typography>
        </Box>
      </Card>
    </Grid >
    /*<Grid>
      <Card
        className={correct ? classes.correctCard : classes.card}
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            borderTopLeftRadius: "10px",
            backgroundColor: "rgba(0, 27, 73, 0.5)",
            borderBottomLeftRadius: "10px"
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography className={classes.answer}>{answer}</Typography>
              <IconButton
                size="small"
                className={expanded ? classes.expanded : classes.expand}
              >
                <ExpandMore fontSize="15px" />
              </IconButton>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary
              }}
            />
          </CardContent>
          <Collapse in={expanded}>
            <CardContent>
              <Typography className={classes.explanationTitle}>
                Explanation:
              </Typography>
              <Typography className={classes.explanationText}>
                {explanation}
              </Typography>
            </CardContent>
          </Collapse>
        </Box>
        <Box className={classes.cardAnswers}>
          <div>
            <h3>1</h3>
          </div>
        </Box>
      </Card>
    </Grid> */
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
  numAnsweredBoxRight: {
    width: "20%",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  numAnsweredBoxWrong: {
    width: "20%",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
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
    padding: "0px",
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
  }
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
