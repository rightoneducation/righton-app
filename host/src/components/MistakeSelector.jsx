import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles, Button, Box } from "@material-ui/core";

export default function MistakeSelector({
  mistakeText,
  mistakePercent,
  isTop3Mode
}) {
  const classes = useStyles();
  const [isSelected, setIsSelected] = React.useState(false);
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
        sx={{
          paddingLeft: (isSelected && !isTop3Mode) ? `7px` : '8px',
          paddingRight: (isSelected && !isTop3Mode) ? `31px` : '32px',
          opacity: isSelected ? 1 : 0.5,
          textAlign: 'left',
        }}
      >
        {mistakeText}
      </Typography>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            paddingRight: (isSelected && !isTop3Mode) ? `23px` : `24px`,
            opacity: 0.5,
          }}
        >
          {mistakePercent}
        </Typography>
        <Box className={classes.selectIndicatorContainer} sx={{right: (isSelected && !isTop3Mode) ? `14px` : `16px`}} >
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
          onClick={() => setIsSelected(!isSelected)}
          variant="text"
          className={isSelected ? classes.top3MistakeSelectorSelected : classes.top3MistakeSelector}
        >
          {buttonContents}
        </Button>
      );
    case false:
      return (
        <Button
          onClick={() => setIsSelected(!isSelected)}
          variant="text"
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
}

const useStyles = makeStyles(() => ({
  top3MistakeSelectorSelected: {
    ...mistakeSelectorBase,
    backgroundColor: `rgba(255, 255, 255, 0.10)`
  },
  top3MistakeSelector: {
    ...mistakeSelectorBase,
    backgroundColor: `rgba(255, 255, 255, 0.05)`

  },
  manualMistakeSelectorSelected: {
    ...mistakeSelectorBase,
    border: `2px solid white`,
  },
  manualMistakeSelector: {
    ...mistakeSelectorBase,
    border: `1px solid white`,
  },
  selectIndicatorContainer: {
    position: 'relative',
    width: `16px`,
    height: `16px`,
    paddingTop: '2px',
  }
}));
