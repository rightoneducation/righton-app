import React from "react";
import { makeStyles, Grid, Box } from "@material-ui/core";

export default function Header() {
  const classes = useStyles();
  return (
    <Grid>
      <hr className={classes.line} />
      <Box className={classes.button}>
        <button className={classes.viewDataButton}>
          <p className={classes.viewDataButtonText}>View Individual Data</p>
        </button>
      </Box>
      <Box className={classes.button}>
        <button className={classes.backButton}>
          <p className={classes.backButtonText}>Back to Menu</p>
        </button>
      </Box>
    </Grid >
  );
}

const useStyles = makeStyles(() => ({
  line: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    height: "1px",
    border: "none",
    marginBottom: "10px"
  },
  button: {
    display: "flex",
    justifyContent: "center"
  },
  viewDataButton: {
    background: "linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)",
    width: "90%",
    borderRadius: "34px",
    border: "none",
    textAlign: "center",
    width: "100%",
    marginButton: "3%",
    marginBottom: "10px"
  },
  viewDataButtonText: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "30px",
    color: "#FFFFFF",
    padding: "8px",
  },
  backButton: {
    background: "transparent",
    width: "90%",
    borderRadius: "34px",
    border: "4px solid rgba(21, 158, 250, 1)",
    textAlign: "center",
    width: "100%",
    marginBottom: "5%"
  },
  backButtonText: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "30px",
    color: "rgba(21, 158, 250, 1)",
    padding: "6px",
  }
}));