import React from 'react';
import { Typography, makeStyles, Box, ButtonGroup, Button } from '@material-ui/core';

export default function EnableShortAnswerCard ({ 
  isShortAnswerEnabled,
  handleShortAnswerChange
}) {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>
          Responses
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        <ButtonGroup disableElevation 
          variant="contained" 
          color="primary"
          className={classes.buttonGroup}
        >
          <Button className={classes.button}> MULTIPLE CHOICE </Button>
          <Button className={classes.button}> SHORT ANSWER </Button>
        </ButtonGroup>
      </div>
      <div className={classes.answerContainer}>
        <Typography className={classes.text}>
          Players will be asked to pick from a list of possible answers.
        </Typography>
      </div>
   </Box>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    //padding: `16px`,
    backgroundColor: 'rgba(0,0,0,0)', // this will be converted to Paper with background color for host 2.0
    width: "100%", // hardcoded to match GameCard width
    gap: '16px',
    boxSizing: 'border-box',
    elevation: 0
  },
  title: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    textTransform: "none",
  },
  titleContainer: {
    marginTop: '3%',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  buttonContainer: {
    width: '100%',
  },
  buttonGroup: {
    display: 'flex', 
    justifyContents: 'center', 
    alignItems: 'center', 
    width: '100%'
  },
  button: {
    width: '300px',
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400'
  },
  answerContainer: {
    display: "flex",
    justifyContent: "center",
  },
});