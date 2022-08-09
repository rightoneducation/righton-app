import React from "react";
import { makeStyles } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import PlayerScores from "../components/RankingsScores";
import HeaderRanking from "../components/HeaderRanking";

export default function Ranking() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.content}>
        <HeaderRanking />
        <PlayerScores />
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
    background: "linear-gradient(right,#0F78BD,#043373)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  content: {
    width: "85%",
    padding: "0px"
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
