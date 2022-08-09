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
        <div className={classes.scores}>
          <PlayerScores />
        </div>
        <FooterRanking />
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  background: {
    height: "110vh",
    width: "100%",
    background: "linear-gradient(right,#0F78BD,#043373)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  content: {
    width: "85%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "0px",
  },
  scores: {
    overflow: "scroll",
  }
}));
