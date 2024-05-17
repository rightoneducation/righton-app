import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Fade, MenuItem, Select, Tooltip, Checkbox, Radio, RadioGroup } from '@material-ui/core';
import { SortDirection, SortField } from '../lib/API/QueryInputs';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';
import SortbyIcon from '../images/SortByIcon.svg';
import SortAscendingIcon from '../images/SortAscendingIcon.svg';
import SortDescendingIcon from '../images/SortDescendingIcon.svg';
import { PublicPrivateType } from '@righton/networking';
import { set } from 'lodash';

export default function SortByDropdown({ 
    isGames, 
    listQuerySettings, 
    handleUpdateListQuerySettings, 
    sortByCheck, 
    setSortByCheck, 
    isUserAuth,
    publicPrivateQueryType,
    handlePublicPrivateChange
 }) {
  const classes = useStyles(sortByCheck)();
  const arrowClass = sortByCheck ? "sortByArrowActive" : "sortByArrow";
  let sortDirection = listQuerySettings.sortDirection;
  const [sortField, setSortField] = useState(null);
  const [filterPublic, setFilterPublic] = useState(PublicPrivateType.PUBLIC);
  
  const handleUpdateValue = (sortField) => {
    sortDirection = listQuerySettings.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    setSortField(sortField);
    handleUpdateListQuerySettings({...listQuerySettings, sortDirection: sortDirection, sortField: sortField});
  };

  const handleRadioChange = (event) => {
    console.log(event.target.value);
        handlePublicPrivateChange(event.target.value);
  };

  const sortDirectionIconElement = [
    listQuerySettings.sortDirection === SortDirection.DESC 
      ? <img src={SortDescendingIcon} alt="Sort Descending Icon" className={classes.sortByIcon} />
      : <img src={SortAscendingIcon} alt="Sort Ascending Icon" className={classes.sortByIcon} />
  ];

  return(
    <div className={classes.sortByWrapper}>
        <div className={classes.sortByHeader} onClick={() => {setSortByCheck((prev) => !prev)}}>
          <Tooltip title='Sort By' enterTouchDelay={700} enterDelay={1000} enterNextDelay={1000} placement="top">
           <img src={SortbyIcon} className={classes.sortByTitleIcon}  alt="Sort By Icon" />
          </Tooltip>
        </div>
        <Fade in={sortByCheck} timeout={500}>
          <div className={classes.sortByBody}>
            <table width='100%'>
            <tbody>
                 <>
                  <tr>
                    <td>
                        <div className={classes.sortByTitle}>Filter </div>
                    </td>
                  </tr>
                  <tr className={classes.sortByTableRow}>
                    <td>
                      <div className={classes.sortByName}>Public {isGames ? 'Games' : 'Questions' }</div>
                    </td>
                    <td >
                      <Radio
                        checked={publicPrivateQueryType === PublicPrivateType.PUBLIC}
                        value={PublicPrivateType.PUBLIC} 
                        onChange={handleRadioChange}                 
                        sx={{
                          '&, &.Mui-checked': {
                            color: '#159EFA',
                          },
                        }}
                      />
                    </td>
                  </tr>
                  <tr className={classes.sortByTableRow}>
                    <td>
                      <div className={classes.sortByName} onClick={()=>handleUpdateValue(SortField.UPDATEDAT)}>Private {isGames ? 'Games' : 'Questions' }</div>
                    </td>
                    <td>
                      <Radio 
                        checked={publicPrivateQueryType === PublicPrivateType.PRIVATE}
                        value={PublicPrivateType.PRIVATE}
                        onChange={handleRadioChange}                 
                        sx={{
                          '&, &.Mui-checked': {
                            color: '#159EFA',
                          },
                        }}
                      />
                    </td>
                  </tr>
                  </>
              <tr>
                <td>
                    <div className={classes.sortByTitle}>Sort By</div>
                </td>
              </tr>
              <tr className={classes.sortByTableRow}>
                <td>
                  <div className={classes.sortByName} onClick={()=>handleUpdateValue(SortField.UPDATEDAT)}>Last Updated</div>
                </td>
                <td >
                  {listQuerySettings.sortField === SortField.UPDATEDAT && sortDirectionIconElement}
                  </td>
              </tr>
              <tr className={classes.sortByTableRow}>
                <td>
                  <div className={classes.sortByName} onClick={()=>handleUpdateValue(SortField.COUNT)}> {isGames ? `Question` : `Game`} Count</div>
                </td>
                <td className={classes.sortByIcon}>
                  {listQuerySettings.sortField === SortField.COUNT && sortDirectionIconElement} 
                </td>
              </tr>
              <tr className={classes.sortByTableRow}>
                <td>
                  <div className={classes.sortByName} onClick={()=>handleUpdateValue(SortField.GRADE)}>Grade Level</div>
                </td>
                <td className={classes.sortByIcon}>
                  {listQuerySettings.sortField === SortField.GRADE && sortDirectionIconElement} 
                </td>
                
              </tr>
              </tbody>
            </table>
          </div>
        </Fade>
    </div>
  );
};

const useStyles = (sortByCheck) => makeStyles(theme => ({
    sortByWrapper: {
      color: 'white',
      fontFamily: 'Poppins',
      width: '75px',
      cursor: 'pointer',
      position: 'relative'
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
      paddingLeft: '16px'
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
      direction: 'column'
    },
    sortByName: {
      fontSize: '16px',
      lineHeight: '39px',
      color: '#768092',
      paddingLeft: '16px',
      cursor: 'pointer',
    },
    sortByTitleIcon:{
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      margin: 'auto',
    },
    sortByIcon: {
      paddingRight:'8px',
    }
  }));