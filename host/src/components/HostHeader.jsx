import React from "react";
import GameCode from "./GameCode";
import { makeStyles } from "@material-ui/core";
import ModeToggle from "./ModeToggle";
import ClearIcon from "@material-ui/icons/Clear";

const HostHeader = ({ gameCode, currentQuestionIndex }) => {
  const classes = useStyles();
  return (
    <div className={classes.headerContainer}>
      {/*<ModeToggle /> removing per integration test #1*/}
      <div>
        {/*<ClearIcon className={classes.clearIconGameCode} /> removing per integration test #1*/}
        <GameCode gameCode={gameCode} currentQuestionIndex={currentQuestionIndex}/>
      </div>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  headerContainer: {
    padding: '8%'
  },
  clearIconGameCode: {
    color: "white",
    position: "absolute",
    padding: "3%",
    marginLeft: "3%"
  }
}));

export default HostHeader;
