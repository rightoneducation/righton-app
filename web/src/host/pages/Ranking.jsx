import React from "react";
import { makeStyles } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import FooterRanking from "../components/FooterRanking";

const scores = [
  {
    id: 1,
    name: "Player1",
    score: 80
  },
  {
    id: 2,
    name: "Player2",
    score: 60
  },
  {
    id: 3,
    name: "Player3",
    score: 40
  },
  {
    id: 4,
    name: "Player4",
    score: 30
  }
];

export default function Ranking() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.color}>
        <h1>Final Results</h1>
      </div>
      <div className={classes.color}>
        <p>LeaderBoard</p>
      </div>

      <div className={classes.ranking}>
        {scores
          .sort((a, b) => (b[scores.score] - a[scores.score] ? 1 : -1))
          .map((scores, index) => (
            <MenuItem
              container
              className={classes.ranks}
              id={index + 1}
              key={scores.score}
              value={scores.name}
            >
              <grid item xs={8} className={classes.rankName}>
                #{index + 1}:{scores.name}
              </grid>
              <grid item xs={4} className={classes.rankScore}>
                {scores.score}
              </grid>
            </MenuItem>
          ))}
      </div>
     <FooterRanking/>
      
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(right,#0F78BD,#043373)"
  },
  color: {
    color: "white",
    marginLeft: "5%"
  },
  ranking: {
    // height: "60%",
    height: "55%",
    marginLeft: "5%",
    marginRight: "5%",
    overflow: "scroll"
  },
  ranks: {
    border: "1px solid #375E93",
    borderRadius: "10px",
    height: "15%",
    marginBottom: "8px"
  },
  rankName: {
    color: "white",
    fontWeight: "bold"
  },
  rankScore: {
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    right: "20px",
    backgroundColor: "#375F94"
  }
}));
