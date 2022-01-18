import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SORT_TYPES } from '../lib/sorting';
import { Collapse, MenuItem, Select } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';

export default function SortByDropdown({ handleSortChange }) {
    const classes = useStyles();
    const [sortByCheck, setSortByCheck] = React.useState(true);
    const arrowClass = sortByCheck ? "sortByArrowActive" : "sortByArrow";

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
                      <p className={classes.sortByName}>Date Changed</p>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <div className={classes.sortByOptions}>
                        <Select
                          className={classes.sortByDropDowns}
                          name="Date Changed"
                          disableUnderline
                          displayEmpty
                          onChange={handleSortChange}
                          defaultValue={SORT_TYPES.UPDATED}
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
                      <p className={classes.sortByName}>Alphabetical</p>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <div className={classes.sortByOptions}>
                        <Select
                          className={classes.sortByDropDowns}
                          name="Alphabetical"
                          disableUnderline
                          displayEmpty
                          onChange={handleSortChange}
                          defaultValue=""
                          MenuProps={{classes: {paper: classes.MenuProps}}}
                        >
                          <MenuItem value="">---</MenuItem>
                          <MenuItem value={SORT_TYPES.ALPHABETICAL}>A to Z</MenuItem>
                          <MenuItem value={SORT_TYPES.REVERSEALPHABETICAL}>Z to A</MenuItem>
                        </Select>
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>
                      <p className={classes.sortByName}>Question Count</p>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <div className={classes.sortByOptions}>
                        <Select
                          className={classes.sortByDropDowns}
                          disableUnderline
                          displayEmpty
                          defaultValue=""
                          MenuProps={{classes: {paper: classes.MenuProps}}}
                        >
                          <MenuItem value="">---</MenuItem>
                          <MenuItem value={1}>Ascending</MenuItem>
                          <MenuItem value={2}>Descending</MenuItem>
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
                          disableUnderline
                          displayEmpty
                          defaultValue=""
                          MenuProps={{classes: {paper: classes.MenuProps}}}
                        >
                          <MenuItem value="">---</MenuItem>
                          <MenuItem value={1}>Test1</MenuItem>
                          <MenuItem value={2}>Test2</MenuItem>
                        </Select>
                      </div>
                    </td>
                  </tr> */}
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
      marginLeft: 15,
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
      zIndex: 3,
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
      transform: 'rotate(0deg) scale(0.7)',
      position: 'absolute',
      right: 7,
      top: 2,
    },
    sortByArrowActive: {
      transition: 'transform 0.4s',
      transform: 'rotate(90deg) scale(0.7)',
      position: 'absolute',
      right: 7,
      top: 2,
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
      zIndex: 2,
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
      width: 107,
      marginRight: 10,
      padding: '3px',
      textAlign: 'left',
    },
    sortByDropDowns: {
      width: 107,
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
            fontFamily: 'Poppins',
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