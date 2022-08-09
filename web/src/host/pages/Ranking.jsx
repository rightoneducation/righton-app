import React from "react";
import { makeStyles } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import HeaderRanking from "../components/HeaderRanking";

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
      <HeaderRanking/>

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
      <hr
        style={{ width: "95%", color: "#00296D", backgroundColor: "#002A6E" }}
      />
      <button
        className={classes.button}
        style={{
          marginBottom: "2%",
          backgroundColor: "#00A1FF",
          color: "white"
        }}
      >
        View individual Data
      </button>
      <button className={classes.button} style={{ color: "#00A1FF" }}>
        Back to Menu
      </button>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)"
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
  },
  button: {
    fontWeight: "bold",
    width: "90%",
    height: "45px",
    display: "center",
    background: "none",
    borderRadius: "24px",
    borderColor: "#00A1FF",
    borderStyle: "solid",
    borderWidth: "thick",
    textAlign: "center",
    marginLeft: "5%",
    marginRight: "5%"
  }
}));
