import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, MenuItem, Select, Tooltip } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';
import { SORT_TYPES } from '../lib/sorting';
import SortbyIcon from '../images/SortByIcon.svg';
import SortAscendingIcon from '../images/SortAscendingIcon.svg';
import SortDescendingIcon from '../images/SortDescendingIcon.svg';

export default function SortByDropdown({
  handleSortChange,
  sortByCheck,
  setSortByCheck,
  isResolutionMobile,
}) {
  const classes = useStyles(sortByCheck, isResolutionMobile)();
  const arrowClass = sortByCheck ? 'sortByArrowActive' : 'sortByArrow';

  const [updatedValue, setUpdatedValue] = React.useState(SORT_TYPES.UPDATED);
  const [qcValue, setQCValue] = React.useState('');
  const [gradeValue, setGradeValue] = React.useState('');

  const handleUpdatedValue = () => {
    switch (updatedValue) {
      case SORT_TYPES.UPDATED:
        setUpdatedValue(SORT_TYPES.OLDEST);
        handleSortChange(SORT_TYPES.OLDEST);
        break;
      case SORT_TYPES.OLDEST:
      case '':
        setUpdatedValue(SORT_TYPES.UPDATED);
        handleSortChange(SORT_TYPES.UPDATED);
        break;
    }
    setQCValue('');
    setGradeValue('');
  };
  const handleQCValue = () => {
    switch (qcValue) {
      case SORT_TYPES.QUESTIONDESCENDING:
        setQCValue(SORT_TYPES.QUESTIONASCENDING);
        handleSortChange(SORT_TYPES.QUESTIONASCENDING);
        break;
      case SORT_TYPES.QUESTIONASCENDING:
      case '':
        setQCValue(SORT_TYPES.QUESTIONDESCENDING);
        handleSortChange(SORT_TYPES.QUESTIONDESCENDING);
        break;
    }
    setUpdatedValue('');
    setGradeValue('');
  };
  const handleGradeValue = () => {
    switch (gradeValue) {
      case SORT_TYPES.GRADEDESCENDING:
        setGradeValue(SORT_TYPES.GRADEASCENDING);
        handleSortChange(SORT_TYPES.GRADEASCENDING);
        break;
      case SORT_TYPES.GRADEASCENDING:
      case '':
        setGradeValue(SORT_TYPES.GRADEDESCENDING);
        handleSortChange(SORT_TYPES.GRADEDESCENDING);
        break;
    }
    setUpdatedValue('');
    setQCValue('');
  };

  return (
    <div className={classes.sortByWrapper}>
      <div
        className={classes.sortByHeader}
        onClick={() => {
          setSortByCheck((prev) => !prev);
        }}
      >
        <Tooltip
          title="Sort By"
          enterTouchDelay={700}
          enterDelay={1000}
          enterNextDelay={1000}
          placement="top"
        >
          <img
            src={SortbyIcon}
            className={classes.sortByTitleIcon}
            alt="Sort By Icon"
          />
        </Tooltip>
      </div>
      <Collapse in={sortByCheck} timeout={0}>
        <div className={classes.sortByBody}>
          <table width="100%">
            <tbody>
              <tr>
                <td>
                  <div className={classes.sortByTitle}>Sort By</div>
                </td>
              </tr>
              <tr className={classes.sortByTableRow}>
                <td>
                  <div
                    className={classes.sortByName}
                    onClick={() => handleUpdatedValue()}
                  >
                    Last Updated
                  </div>
                </td>
                <td>
                  {updatedValue === SORT_TYPES.UPDATED ? (
                    <img
                      src={SortDescendingIcon}
                      alt="Sort Descending Icon"
                      className={classes.sortByIcon}
                    />
                  ) : null}
                  {updatedValue === SORT_TYPES.OLDEST ? (
                    <img
                      src={SortAscendingIcon}
                      alt="Sort Ascending Icon"
                      className={classes.sortByIcon}
                    />
                  ) : null}
                </td>
              </tr>
              <tr className={classes.sortByTableRow}>
                <td>
                  <div
                    className={classes.sortByName}
                    onClick={() => handleQCValue()}
                  >
                    Question Count
                  </div>
                </td>
                <td className={classes.sortByIcon}>
                  {qcValue === SORT_TYPES.QUESTIONDESCENDING ? (
                    <img
                      src={SortDescendingIcon}
                      alt="Sort Descending Icon"
                      className={classes.sortByIcon}
                    />
                  ) : null}
                  {qcValue === SORT_TYPES.QUESTIONASCENDING ? (
                    <img
                      src={SortAscendingIcon}
                      alt="Sort Ascending Icon"
                      className={classes.sortByIcon}
                    />
                  ) : null}
                </td>
              </tr>
              <tr className={classes.sortByTableRow}>
                <td>
                  <div
                    className={classes.sortByName}
                    onClick={() => handleGradeValue()}
                  >
                    Grade Level
                  </div>
                </td>
                <td className={classes.sortByIcon}>
                  {gradeValue === SORT_TYPES.GRADEDESCENDING ? (
                    <img
                      src={SortDescendingIcon}
                      alt="Sort Descending Icon"
                      className={classes.sortByIcon}
                    />
                  ) : null}
                  {gradeValue === SORT_TYPES.GRADEASCENDING ? (
                    <img
                      src={SortAscendingIcon}
                      alt="Sort Ascending Icon"
                      className={classes.sortByIcon}
                    />
                  ) : null}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Collapse>
    </div>
  );
}

const useStyles = (sortByCheck, isResolutionMobile) =>
  makeStyles((theme) => ({
    sortByWrapper: {
      color: 'white',
      fontFamily: 'Poppins',
      width: '75px',
      cursor: 'pointer',
      position: 'relative',
    },
    sortByHeader: {
      backgroundColor: sortByCheck ? '#768092' : '#B1BACB',
      borderRadius: '20px',
      height: sortByCheck ? '37px' : '35px',
      border: sortByCheck ? '3px solid #768092' : '3px solid #B1BACB',
      borderBottomLeftRadius: sortByCheck ? '0px' : '20px',
      borderBottomRightRadius: sortByCheck ? '0px' : '20px',
    },
    sortByTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '39px',
      color: '#768092',
      paddingLeft: '16px',
    },
    sortByBody: {
      position: 'absolute',
      width: 250,
      right: 0,
      top: '42px',
      paddingBottom: '10px',
      paddingTop: '15px',
      background: 'white',
      borderRadius: '18px',
      borderTopRightRadius: 0,
      border: '2px solid #768092',
      boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.13)',
      display: 'flex',
      direction: 'column',
      zIndex: 1,
    },
    sortByName: {
      fontSize: '16px',
      lineHeight: '39px',
      color: '#768092',
      paddingLeft: '16px',
      cursor: 'pointer',
    },
    sortByTitleIcon: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
    },
    sortByIcon: {
      paddingRight: '8px',
    },
  }));
