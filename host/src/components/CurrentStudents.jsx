import React from "react";
import { makeStyles, MenuItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const CurrentStudents = ({ teams }) => {
  const classes = useStyles();
  return (
    <div>
     <Grid className={classes.studentCount}>{teams ? teams.length : 0}</Grid>
      <div className={classes.inSessionDiv}>
        <p className={classes.inSession}>Students in Session</p>
      </div>
      <hr className={classes.hr} />
      {teams &&
        teams.map((team, id) => (
          <MenuItem className={classes.studentCards} key={id}>
            <Grid className={classes.name}>{team.name}</Grid>
          </MenuItem>
        ))}
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  studentCount: {
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "bold",
    fontSize: "72px",
    textAlign: "center",
    marginTop: "4%"
  },

  inSessionDiv: {
    width: "80px",
    height: "40px",
    margin: "auto"
  },

  inSession: {
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    margin: "auto",
    fontSize: "16px"
  },

  studentCards: {
    margin: "auto",
    marginBottom: "15px",
    borderRadius: "14px",
    width: "311px",
    height: "62px",
    background: "rgba(255, 255, 255, 0.25)",
    color: "rgba(255, 255, 255, 1)",
    fontSize: "24px"
  },
  name: {
    fontWeight: "bold"
  },
  removeStudent: {
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    right: "-10px"
  },
  hr: {
    marginTop: "30px",
    marginBottom: "25px",
    width: "266px",
    height: "1px",
    borderRadius: "1.54px",
    border: "0",
    borderTop: "1px solid rgba(255, 255, 255, 0.25)"
  }
}));

export default CurrentStudents;
