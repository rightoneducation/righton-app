import React from 'react';
import { makeStyles, Button, Box, Typography } from "@material-ui/core";

export default function MistakeSelector({
  mistakeText,
  mistakePercent,
  mistakeIndex,
  isTop3Mode,
  isSelected,
  handleSelectMistake,
}) {
  const classes = useStyles();
  const circleIndicator = [
    <>
      {((isTop3Mode && isSelected) || !isTop3Mode) 
        ?
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
          >
            {isSelected
              ? <circle cx="8" cy="8" r="8" fill="white"/>
              : (!isTop3Mode ? <circle cx="8.00391" cy="8" r="7.5" stroke="#B1BACB"/> : null)
            }
          </svg>
        : null
      }
    </>
  ];
  const buttonContents = (
    <>
      <Typography
        variant="body2"
        style={{
          paddingLeft:   '16px',
          paddingRight: '32px',
          opacity: isSelected ? 1 : 0.5,
          textAlign: 'leftt',
        }}
      >
        {mistakeText}
      </Typography>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          style={{
            paddingRight: `24px`,
            opacity: 0.5,
          }}
        >
          {mistakePercent}%
        </Typography>
        <Box className={classes.selectIndicatorContainer} style={{right:  `16px`}} >
          {circleIndicator} 
        </Box>
      </Box>
    </>
  );
  switch (isTop3Mode) {
    case true:
    default:
      return (
        <Button
          key={isSelected ? 'selected' : 'unselected'} 
          variant="text"
          disableRipple
          disabled
          className={isSelected ? classes.top3MistakeSelectorSelected : classes.top3MistakeSelector}
        >
          {buttonContents}
        </Button>
      );
    case false:
      return (
        <Button
          key={isSelected ? 'selected' : 'unselected'} 
          onClick={() => handleSelectMistake(mistakeIndex)}
          variant="text"
          disableRipple
          className={isSelected ? classes.manualMistakeSelectorSelected : classes.manualMistakeSelector}
        >
         {buttonContents}
        </Button>
      );
  }
}

const mistakeSelectorBase = {
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '42px',
  borderRadius: '22px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  color: 'white',
  "&:disabled": {
    color: 'white',
  }
}

const useStyles = makeStyles(() => ({
  top3MistakeSelectorSelected: {
    ...mistakeSelectorBase,
    backgroundColor: `rgba(255, 255, 255, 0.10)`,
    "&.MuiButtonBase-root:hover": {
      backgroundColor: `rgba(255, 255, 255, 0.10)`
    }
  },
  top3MistakeSelector: {
    ...mistakeSelectorBase,
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    "&.MuiButtonBase-root:hover": {
      backgroundColor: `rgba(255, 255, 255, 0.05)`
    }

  },
  manualMistakeSelectorSelected: {
    ...mistakeSelectorBase,
    outline: `2px solid white`,
    "&.MuiButtonBase-root:hover": {
      backgroundColor: `transparent`
    }
  },
  manualMistakeSelector: {
    ...mistakeSelectorBase,
    outline: `1px solid white`,
    "&.MuiButtonBase-root:hover": {
      backgroundColor: `transparent`
    }
  },
  selectIndicatorContainer: {
    position: 'relative',
    width: `16px`,
    height: `16px`,
    paddingTop: '2px',
  }
}));