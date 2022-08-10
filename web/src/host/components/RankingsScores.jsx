import React from "react";
import { makeStyles, Card, Box, Grid } from "@material-ui/core";

const scores = [
  {
    id: 1,
    name: "Player 1",
    score: 80
  },
  {
    id: 2,
    name: "Player 2",
    score: 60
  },
  {
    id: 3,
    name: "Player 3",
    score: 40
  },
  {
    id: 4,
    name: "Player 4",
    score: 30
  },
  {
    id: 5,
    name: "Player 5",
    score: 10
  },
  {
    id: 6,
    name: "Player 6",
    score: 100
  },
  {
    id: 7,
    name: "Player 7",
    score: 20
  },
  {
    id: 8,
    name: "Player 8",
    score: 40
  },
  {
    id: 9,
    name: "Player 9",
    score: 30
  },
  {
    id: 10,
    name: "Player 10",
    score: 10
  },
  {
    id: 11,
    name: "Player 11",
    score: 100
  },
  {
    id: 12,
    name: "Player 12",
    score: 20
  },
  {
    id: 13,
    name: "Player 8",
    score: 40
  }
];

export default function PlayerScores() {
  const classes = useStyles();
  const highToLow = scores.sort((a, b) => b.score - a.score);

  function rank(index) {
    switch (index) {
      case 0: return [classes.rankingFirstPlace, classes.scoreBoxFirstPlace];
      case 1: return [classes.rankingSecondPlace, classes.scoreBoxSecondPlace];
      case 2: return [classes.rankingThirdPlace, classes.scoreBoxThirdPlace];
      default: return [classes.rankingOther, classes.scoreBoxOtherPlace];
    }
  }

  {
    return (
      <Grid className={classes.rankings}>
        {highToLow.map((score, index) => {
          return (
            <Card className={rank(index)[0]}>
              <Box>
                <p className={classes.text}>#{index + 1}: {score.name}</p>
              </Box>
              <Box className={rank(index)[1]}>
                <p className={classes.text}>{score.score}</p>
              </Box>
            </Card>
          );
        })}
      </Grid>);
  }
}

const useStyles = makeStyles(theme => ({
  rankings: {
    padding: "0px",
    height: "auto"
  },
  rankingFirstPlace: {
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "7px",
    boxShadow: "none",
    border: "2px solid #EAA657",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rankingSecondPlace: {
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "7px",
    boxShadow: "none",
    border: "2px solid #9D9D9D",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rankingThirdPlace: {
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "7px",
    boxShadow: "none",
    border: "2px solid #E3694E",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rankingOther: {
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "7px",
    boxShadow: "none",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "27px",
    color: "#FFFFFF",
    padding: "10px"
  },
  scoreBoxFirstPlace: {
    background: "linear-gradient(90deg, #EAA657 0%, #F9D649 51.56%, #EAA657 100%)",
    borderRadius: "0px 10px 10px 0px",
    width: "70px",
    display: "flex",
    justifyContent: "center"
  },
  scoreBoxSecondPlace: {
    background: "linear-gradient(90deg, #9D9D9D 0%, #D5D5D5 51.56%, #9D9D9D 100%)",
    borderRadius: "0px 10px 10px 0px",
    width: "70px",
    display: "flex",
    justifyContent: "center"
  },
  scoreBoxThirdPlace: {
    background: "linear-gradient(90deg, #E3694E 0%, #EF905B 51.56%, #E3694E 100%)",
    borderRadius: "0px 10px 10px 0px",
    width: "70px",
    display: "flex",
    justifyContent: "center"
  },
  scoreBoxOtherPlace: {
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "0px 10px 10px 0px",
    width: "70px",
    display: "flex",
    justifyContent: "center"
  }
}));



