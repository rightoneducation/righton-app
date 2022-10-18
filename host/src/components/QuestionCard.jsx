import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Button
} from "@material-ui/core";
import { AddBox, IndeterminateCheckBox } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  fontStyle: {
    paddingBottom: "10px",
    fontFamily: "Karla",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "16px"
  },
  questionStyle: {
    fontSize: "14px",
    fontWeight: "bold"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    padding: "20px 20px 5px 20px",
    fontSize: "10px",
  },
  questionCard: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    padding: "0px",
    backgroundColor: "white",
    width: "80%",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
  },
  expand: {
    display: "flex",
    width: "100%",
    height: "50px",
    padding: "0px",
    float: "bottom",
    color: "#1C55FD",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
    padding: "20px 40px"
  },
  expandButton: {
    display: "flex",
    justifyContent: "center",
    padding: "0px",
    background: "#F4F4F4"
  }
}));

export default function QuestionCard({
  question,
  image
}) {
  
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [stat, setStat] = useState(0);
  const hideaway = ["Show More", "Show Less"];
  const box = [<AddBox />, <IndeterminateCheckBox />];

  const handleExpandClick = () => {
    if (expanded === true) {
      setStat(0);
    }
    if (expanded === false) {
      setStat(1);
    }
    setExpanded(!expanded);
  };

  return (
    <Grid container className={classes.centerContent}>
      <Card className={classes.QuestionCard} style={{ borderRadius: "18px" }}>
        <CardContent className={classes.content}>
          <Typography className={classes.questionStyle}>{question}</Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.content}>
            <img src={image} alt="" />
          </CardContent>
        </Collapse>
        <CardActions disableSpacing className={classes.expandButton}>
          <Button
            className={classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <p className={classes.centerContent}>
              {box[stat]}
              {hideaway[stat]}
            </p>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
