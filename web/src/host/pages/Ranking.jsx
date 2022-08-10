import React from "react";
import { makeStyles } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import PlayerScores from "../components/RankingsScores";
import HeaderRanking from "../components/HeaderRanking";
import FooterRanking from "../components/FooterRanking";

export default function Ranking() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <div className={classes.content}>
        <HeaderRanking />
        <PlayerScores />
      </div>
      <FooterRanking />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "100vh",
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(bottom,#02215F,#0D68B1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  content: {
    width: "85%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "0px"
  },
  scores: {
    overflow: "scroll",
  }
}));
