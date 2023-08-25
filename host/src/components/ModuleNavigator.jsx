import React, { useState } from "react";
import { makeStyles, Select, MenuItem, Button, Box } from "@material-ui/core";
import UpArrowIcon from '../images/UpArrowIcon.svg'
import DownArrowIcon from '../images/DownArrowIcon.svg'
import LeftArrowIcon from '../images/LeftArrowIcon.svg'

export default function ModuleNavigator({
  selectedNavValue, 
  handleNavUpClick, 
  handleNavDownClick, 
  handleSelectedNavChange, 
  graphClickInfo, 
  setGraphClickInfo
}) {
  const classes = useStyles();
  // TODO: make this an enum when we upgrade host to typescript
  const selectedDictionary = {
    0: 'Question Card',
    1: 'Answer Explanations',
    2: 'Confidence Level',
    3: 'Player Thinking',
    4: 'Popular Mistakes'
  }
  return (
    <div className={classes.container}>
      { graphClickInfo && graphClickInfo.graph === null ? 
      <>
        <Select
          value={selectedNavValue}
          displayEmpty
          disableUnderline
          onChange={handleSelectedNavChange}
        
          className={classes.dropdown}
          MenuProps={{ 
            classes: { paper: classes.select },   
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            },
            getContentAnchorEl: null 
          }}
          renderValue={(value) => {
            return <span className={classes.selectedItem}>{selectedDictionary[selectedNavValue]}</span>;
          }}
        >
          <MenuItem value={0} className={classes.menuItem}>Question Card</MenuItem>
          <MenuItem value={1} className={classes.menuItem}>Answer Explanations</MenuItem>
        </Select>
        <Box className={classes.buttonContainer}>
          <Button className={classes.button} startIcon={<img src={UpArrowIcon}></img>} onClick={handleNavUpClick}/>
          <Button className={classes.button} startIcon={<img src={DownArrowIcon}></img>} onClick={handleNavDownClick}/>
        </Box>
      </>
      : 
      <Box className={classes.backButtonContainer}>
          <Button 
            className={classes.backButton} 
            startIcon={<img src={LeftArrowIcon} 
            style={{paddingRight: '16px'}}></img>} 
            onClick={() => setGraphClickInfo({graph: null, index: null})}
          > 
            Question Overview 
          </Button>
      </Box>
      }
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  dropdown: {
   width: '100%',
   background: 'rgba(255, 255, 255, 0.2)',
   borderRadius: '100px',
  },
  select: {
    background: 'rgba(61, 81, 122, 1)',
    transitionDuration: 0,
  },
  selectedItem: {
    paddingLeft: '16px',
    color: 'white'
  },
  menuItem:{
    color: 'white',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  button: {
    height: '32px',
    width: '32px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    minWidth: '32px',
   margin: 'auto',
   "& .MuiButton-startIcon": {
    marginRight: 0,
    marginLeft: 0
  }
  },
  backButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  backButton: {
    height: '32px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '100px',
    minWidth: '32px',
   padding: '16px',
   textTransform: 'none',
   color: 'white',
   "& .MuiButton-startIcon": {
    marginRight: 0,
    marginLeft: 0
  }
  }
}));