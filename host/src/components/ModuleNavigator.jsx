import React, { useState } from 'react';
import { makeStyles, Select, MenuItem, Button, Box } from '@material-ui/core';
import UpArrowIcon from '../images/UpArrowIcon.svg';
import DownArrowIcon from '../images/DownArrowIcon.svg';
import LeftArrowIcon from '../images/LeftArrowIcon.svg';

export default function ModuleNavigator({
  graphClickInfo,
  setGraphClickInfo,
  navDictionary,
  statePosition
}) {
  const classes = useStyles();
  const modifiedNavDictionary =
    statePosition === 1 ? navDictionary.slice(1) : navDictionary;
  const [selectedNavValue, setSelectedNavValue] = useState(0);
  const handleSelectedNavChange = (event) => {
    setTimeout(() => {
      modifiedNavDictionary[event.target.value].ref.current.scrollIntoView({
        behavior: 'smooth',
      });
    }, 0);
    setSelectedNavValue(event.target.value);
  };
  const handleNavUpClick = () => {
    const newValue = selectedNavValue > 0 ? selectedNavValue - 1 : 0;
    modifiedNavDictionary[newValue].ref.current.scrollIntoView({ behavior: 'smooth' });
    setSelectedNavValue(newValue);
  };
  const handleNavDownClick = () => {
    const newValue =
      selectedNavValue < modifiedNavDictionary.length - 1
        ? selectedNavValue + 1
        : modifiedNavDictionary.length - 1;
        modifiedNavDictionary[newValue].ref.current.scrollIntoView({ behavior: 'smooth' });
    setSelectedNavValue(newValue);
  };
  return (
    <div className={classes.container}>
      {graphClickInfo && graphClickInfo.graph === null ? (
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
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            }}
            renderValue={(value) => {
              return (
                <span className={classes.selectedItem}>
                  {modifiedNavDictionary[selectedNavValue].text}
                </span>
              );
            }}
          >
            {modifiedNavDictionary.map((item, index) => {
              return (
                <MenuItem value={index} className={classes.menuItem}>
                  {item.text}
                </MenuItem>
              );
            })}
          </Select>
          <Box className={classes.buttonContainer}>
            <Button
              className={classes.button}
              startIcon={<img src={UpArrowIcon}></img>}
              onClick={handleNavUpClick}
            />
            <Button
              className={classes.button}
              startIcon={<img src={DownArrowIcon}></img>}
              onClick={handleNavDownClick}
            />
          </Box>
        </>
      ) : (
        <Box className={classes.backButtonContainer}>
          <Button
            className={classes.backButton}
            startIcon={
              <img src={LeftArrowIcon} style={{ paddingRight: '16px' }}></img>
            }
            onClick={() => setGraphClickInfo({ graph: null, index: null })}
          >
            Question Overview
          </Button>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
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
    color: 'white',
  },
  menuItem: {
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
    '& .MuiButton-startIcon': {
      marginRight: 0,
      marginLeft: 0,
    },
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
    '& .MuiButton-startIcon': {
      marginRight: 0,
      marginLeft: 0,
    },
  },
}));
