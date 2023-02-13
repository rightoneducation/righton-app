import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SORT_TYPES } from '../lib/sorting';
import { Collapse, MenuItem, Select } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';

export default function SortByDropdown({ handleSortChange, sortByCheck, setSortByCheck }) {
  const classes = useStyles();
  const arrowClass = sortByCheck ? "sortByArrowActive" : "sortByArrow";

  const [updatedValue, setUpdatedValue] = React.useState(SORT_TYPES.UPDATED);
  const [qcValue, setQCValue] = React.useState("");
  const [gradeValue, setGradeValue] = React.useState("");

  const handleUpdatedValue = (event) => {
    setUpdatedValue(event.target.value);
    setQCValue("");
    setGradeValue("");
    handleSortChange(event);
  };
  const handleQCValue = (event) => {
    setQCValue(event.target.value);
    setUpdatedValue("");
    setGradeValue("");
    handleSortChange(event);
  };
  const handleGradeValue = (event) => {
    setGradeValue(event.target.value);
    setUpdatedValue("");
    setQCValue("");
    handleSortChange(event);
  };

  return(
    <div className={classes.sortByWrapper}>
      <div className={classes.sortByHeader} onClick={() => {setSortByCheck((prev) => !prev)}}>
        <p className={classes.sortByTitle}>Sort by</p>
        <ArrowIcon className={classes[arrowClass]} />
      </div>
      <Collapse in={sortByCheck}>
        <div className={classes.sortByBody}>
          <table width="100%">
            <tr>
              <td>
                <p className={classes.sortByName}>Last Updated</p>
              </td>
              <td style={{textAlign: 'right'}}>
                <div className={classes.sortByOptions}>
                  <Select
                    className={classes.sortByDropDowns}
                    name="Last Updated"
                    disableUnderline
                    displayEmpty
                    onChange={handleUpdatedValue}
                    value={updatedValue}
                    MenuProps={{classes: {paper: classes.MenuProps}}}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={SORT_TYPES.UPDATED}>Newest</MenuItem>
                    <MenuItem value={SORT_TYPES.OLDEST}>Oldest</MenuItem>
                  </Select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <p className={classes.sortByName}>Question Count</p>
              </td>
              <td style={{textAlign: 'right'}}>
                <div className={classes.sortByOptions}>
                  <Select
                    className={classes.sortByDropDowns}
                    name="Question Count"
                    disableUnderline
                    displayEmpty
                    onChange={handleQCValue}
                    value={qcValue}
                    MenuProps={{classes: {paper: classes.MenuProps}}}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={SORT_TYPES.QUESTIONASCENDING}>Ascending</MenuItem>
                    <MenuItem value={SORT_TYPES.QUESTIONDESCENDING}>Descending</MenuItem>
                  </Select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <p className={classes.sortByName}>Grade Level</p>
              </td>
              <td style={{textAlign: 'right'}}>
                <div className={classes.sortByOptions}>
                  <Select
                    className={classes.sortByDropDowns}
                    name="Grade Level"
                    disableUnderline
                    displayEmpty
                    onChange={handleGradeValue}
                    value={gradeValue}
                    MenuProps={{classes: {paper: classes.MenuProps}}}
                  >
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value={SORT_TYPES.GRADEASCENDING}>Ascending</MenuItem>
                    <MenuItem value={SORT_TYPES.GRADEDESCENDING}>Descending</MenuItem>
                  </Select>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </Collapse>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
    sortByWrapper: {
      display: 'inline',
      position: 'relative',
      // marginLeft: 15,
      marginBottom: '30px',
      color: '#9BA9D0',
      fontFamily: 'Poppins',
    },
    sortByHeader: {
      display: 'inline-block',
      position: 'absolute',
      padding: '5px 14px',
      width: 216,
      backgroundColor: 'white',
      borderRadius: '18px',
      boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
      zIndex: 1,
        '&:hover': {
          cursor: 'pointer' 
        },
    },
    sortByTitle: {
      fontWeight: 'bold',
      fontSize: '21px',
      lineHeight: '0px',
      display: 'inline',
      marginRight: 75,
    },
    sortByArrow: {
      transition: 'transform 0.4s',
      transform: 'rotate(0deg) scale(0.8)',
      position: 'absolute',
      right: 7,
      top: 4,
    },
    sortByArrowActive: {
      transition: 'transform 0.4s',
      transform: 'rotate(90deg) scale(0.8)',
      position: 'absolute',
      right: 7,
      top: 4,
    },
    sortByBody: {
      display: 'inline-block',
      position: 'absolute',
      width: 338,
      left: 0,
      top: 20,
      paddingBottom: '10px',
      paddingTop: '15px',
      background: 'white',
      borderRadius: '18px',
      boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
      zIndex: 0,
    },
    sortByName: {
      fontSize: '16px',
      lineHeight: '0px',
      display: 'inline',
      marginLeft: 10,
    },
    sortByOptions: {
      display: 'inline-block',
      borderRadius: '18px',
      boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
      backgroundColor: 'white',
      width: 137,
      marginRight: 10,
      padding: '3px',
      textAlign: 'left',
    },
    sortByDropDowns: {
      width: 137,
      padding: '0px 8px',
      fontFamily: 'Poppins',
      color: '#9BA9D0',
        '& .MuiSvgIcon-root': {
          color: '#9BA9D0'
        },
    },
    MenuProps: {
        '& .MuiMenuItem-root': {
            color: '#9BA9D0',
            borderRadius: 18,
            margin: 5,
            padding: '0px 10px',
            width: 107,
            height: 30,
        },
        '& .MuiMenuItem-root.Mui-selected': {
            color: 'white',
            background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
        },
    },
  }));