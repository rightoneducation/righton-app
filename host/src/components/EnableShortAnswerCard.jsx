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
        <ButtonGroup
          disableRipple
          disableElevation 
          variant="contained" 
          color="primary"
          className={classes.buttonGroup}
        >
          <Button 
            disableRipple
            variant={isShortAnswerEnabled ? 'outlined' : 'contained'} 
            className={ classes.button} 
            onClick={() => handleShortAnswerChange(false)}
          > 
            MULTIPLE CHOICE 
          </Button>
          <Button 
            disableRipple
            variant={isShortAnswerEnabled ? 'contained' : 'outlined'} 
            className={classes.button} 
            onClick={() => handleShortAnswerChange(true)}
          >
            SHORT ANSWER
          </Button>
        </ButtonGroup>
      </div>
      <div className={classes.answerContainer}>
        <Typography className={classes.text}>
          {isShortAnswerEnabled ? 
              `Players will be asked to provide a short answer.`
            : `Players will be asked to pick from a list of possible answers.`}
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
    width: '100%',
  },
  button: {
    backgroundColor: '#4994EC',
    color: 'white',
    width: '50%',
    maxWidth: '300px',
    "&.MuiButton-contained": {
      backgroundColor: '#4994EC',
      border: 0,
      "&:hover":{
        backgroundColor: '#4994EC'
      },
      "&.Mui-focusVisible, &:active, &:focus": {
        outlineColor: '#4994EC',
        borderColor: '#4994EC',
      },
    },
    "&.MuiButton-outlined": {
      backgroundColor: 'transparent',
      borderColor: '#4994EC',
      border: '1px solid',
      "&:hover":{
        backgroundColor: 'rgba(73,148,236,0.2)'
      },
      "&.Mui-focusVisible, &:active, &:focus": {
        outlineColor: '#4994EC',
        borderColor: '#4994EC',
      },
    },
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