import React, { useState } from "react";
import { makeStyles, Select, MenuItem, Button, Box } from "@material-ui/core";
import UpArrowIcon from '../images/UpArrowIcon.svg'
import DownArrowIcon from '../images/DownArrowIcon.svg'

export default function ModuleNavigator() {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = useState(0);
  const selectedDictionary = {
    0: 'Real-time Responses',
    1: 'Answer Explanations'
  }
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleUpClick = () => {
    setSelectedValue(selectedValue > 0 ? selectedValue - 1 : 0);
  };

  const handleDownClick = () => {
    setSelectedValue(selectedValue < 1 ? selectedValue + 1 : 1);
  };

  return (
    <div className={classes.container}>
      <Select
        value={selectedValue}
        displayEmpty
        disableUnderline
        onChange={handleChange}
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
          return <span className={classes.selectedItem}>{selectedDictionary[selectedValue]}</span>;
        }}
      >
        <MenuItem value={0} className={classes.menuItem}>Real-time Responses</MenuItem>
        <MenuItem value={1} className={classes.menuItem}>Answer Explanations</MenuItem>
      </Select>
      <Box className={classes.buttonContainer}>
        <Button className={classes.button} startIcon={<img src={UpArrowIcon}></img>} onClick={handleUpClick}/>
        <Button className={classes.button} startIcon={<img src={DownArrowIcon}></img>} onClick={handleDownClick}/>
      </Box>
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
   borderRadius: '100px'
  },
  select: {
    background: 'rgba(61, 81, 122, 1)',
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

  }
}));