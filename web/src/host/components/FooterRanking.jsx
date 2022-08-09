import React from "react";
import { makeStyles, Grid, Box } from "@material-ui/core";

export default function Header() {
  const classes = useStyles();
  return (
    <Grid>
      <hr className={classes.line} />
      <Box className={classes.button}>
        <button className={classes.backButton}>
          <p className={classes.backButtonText}>Exit To RightOn Central</p>
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
  backButton: {
    background: "linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)",
    width: "90%",
    borderRadius: "34px",
    border: "none",
    textAlign: "center",
    width: "100%",
    marginButton: "3%",
    marginBottom: "10px"
  },
  backButtonText: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "30px",
    color: "#FFFFFF",
    padding: "8px",
  }
}));