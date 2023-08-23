import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import Timer from "./Timer";

const useStyles = makeStyles(() => ({
  div: {
    top: 0,
    padding: "16px",
    height: '175px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '700px',
    zIndex: 1
  },
  title: {
    fontWeight: 700,
    fontSize: "36px",
    lineHeight: "54px",
    color: "white",
  },
  phases: {
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "white",
  },
  roundedItem: {
    background: "red",
  },
  ul: {
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "white",
      color: "rgba(56, 68, 102, 1)",
      border: "white solid 3px",
      borderRadius: "3px",
    },
    "& .MuiPaginationItem-root": {
      color: "rgba(255,255,255, 0.5)",
      border: "rgba(255,255,255, 0.5) solid 3px",
      borderRadius: "3px",
      paddingLeft: "15px",
      paddingRight: "15px",
      opacity: "1",
      cursor: "default",
      pointerEvents: "none",
    },
  },
}));

const label = {
    2 : "Phase 1 of 2 - Choose Correct Answer",
    3 : "Phase 1 of 2 - Answer Explanation",
    4 : "Phase 1 of 2 - Results",
    5 : "Phase 2 of 2 - Instructions",
    6 : "Phase 2 of 2 - Choose Trickiest Answer",
    7 : "Phase 2 of 2 - Discussion",
    8 : "Phase 2 of 2 - Results",
    9 : "Proceed to RightOn Central"
};

export default function HeaderGame({
  totalQuestions,
  currentQuestion,
  statePosition,
  headerGameCurrentTime,
  totalRoundTime,
  gameTimer
}) {
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <Pagination
        hideNextButton
        hidePrevButton
        variant="outlined"
        shape="rounded"
        classes={{ ul: classes.ul }}
        count={totalQuestions}
        page={currentQuestion+1}
      /> 
      <Typography className={classes.title}>
        Question {currentQuestion+1} of {totalQuestions}
      </Typography>
      <Typography className={classes.phases}>
        {label[statePosition]} 
      </Typography>
      {gameTimer && <Timer headerGameCurrentTime={headerGameCurrentTime} totalRoundTime={totalRoundTime} />} 
     
    </div>
  );
}
