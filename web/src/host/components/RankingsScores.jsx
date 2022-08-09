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
              <p className={classes.text}>#{index + 1}: {score.name}</p>
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
    padding: "0px"
  },
  rankingFirstPlace: {
    height: "47px",
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: "none",
    border: "2px solid #EAA657",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rankingSecondPlace: {
    height: "47px",
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: "none",
    border: "2px solid #9D9D9D",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rankingThirdPlace: {
    height: "47px",
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: "none",
    border: "2px solid #E3694E",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rankingOther: {
    height: "47px",
    background: "transparent",
    borderRadius: "12px",
    marginBottom: "10px",
    boxShadow: "none",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  text: {
    fontFamily: "Poppins",
    fontWeight: "400px",
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



