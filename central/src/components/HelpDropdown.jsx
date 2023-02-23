import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SORT_TYPES } from '../lib/sorting';
import { Collapse, MenuItem, Select, Tooltip } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';
import HelpMenuIcon from '../images/HelpMenuIcon.svg';
import HelpMenuIconClicked from '../images/HelpMenuIconClicked.svg';
import HelpMenuExploreIcon from '../images/HelpMenuExploreIcon.svg';
import HelpMenuGameMakerIcon from '../images/HelpMenuGameMakerIcon.svg';
import HelpMenuHelpIcon from '../images/HelpMenuHelpIcon.svg';
import HelpMenuAppIcon from '../images/HelpMenuAppIcon.svg';
import HelpMenuAppAndroidIcon from '../images/HelpMenuAppAndroidIcon.svg';
import HelpMenuAboutIcon from '../images/HelpMenuAboutIcon.svg';
import SortAscendingIcon from '../images/SortAscendingIcon.svg';
import SortDescendingIcon from '../images/SortDescendingIcon.svg';

export default function HelpDropdown() {
  const [isHelpMenuClicked, SetIsHelpMenuClicked] = React.useState(false);
  const [updatedValue, setUpdatedValue] = React.useState(SORT_TYPES.UPDATED);
  const [qcValue, setQCValue] = React.useState("");
  const [gradeValue, setGradeValue] = React.useState("");

  const classes = useStyles(isHelpMenuClicked)();

  const handleUpdatedValue = () => {
    switch (updatedValue){
      case SORT_TYPES.UPDATED:
        setUpdatedValue(SORT_TYPES.OLDEST);
        break;
      case SORT_TYPES.OLDEST:
      case "":
        setUpdatedValue(SORT_TYPES.UPDATED);
        break;
    }
    setQCValue("");
    setGradeValue("");
  };
  const handleQCValue = () => {
    switch (qcValue){
      case SORT_TYPES.QUESTIONDESCENDING:
          setQCValue(SORT_TYPES.QUESTIONASCENDING);
          break;
      case SORT_TYPES.QUESTIONASCENDING:
      case "":
        setQCValue(SORT_TYPES.QUESTIONDESCENDING);
        break;
    }
    setUpdatedValue("");
    setGradeValue("");
  };
  const handleGradeValue = () => {
    switch (gradeValue){
      case SORT_TYPES.GRADEDESCENDING:
        setGradeValue(SORT_TYPES.GRADEASCENDING);
        break;
      case SORT_TYPES.GRADEASCENDING:
      case "":
        setGradeValue(SORT_TYPES.GRADEDESCENDING);
        break;
    }
    setUpdatedValue("");
    setQCValue("");
  };

  return(
    <div className={classes.helpWrapper}>
        <div className={classes.helpHeader} onClick={() => {SetIsHelpMenuClicked((prev) => !prev)}}>
          <Tooltip title='Help' enterTouchDelay={700} enterDelay={1000} enterNextDelay={1000} placement="top">
           {!isHelpMenuClicked ? 
           <img src={HelpMenuIcon} className={classes.helpMenuTitleIcon}  alt="Help Menu Icon" />
           :
           <img src={HelpMenuIconClicked} className={classes.helpMenuTitleIcon}  alt="Help Menu Icon Clicked" />
           }
          </Tooltip>
        </div>
        <Collapse in={isHelpMenuClicked} timeout={0}>
          <div className={classes.helpBody}>
            <table width='100%'>
            <tbody>
              <tr className={classes.helpTableRow}>
                <td>
                  <img src={HelpMenuExploreIcon} className={classes.helpIcon}  alt="Explore Icon" />
                </td>
                <td >
                  <div className={classes.helpName} onClick={()=>handleUpdatedValue()}>Explore</div>
                </td>
              </tr>
              <tr className={classes.helpTableRow}>
                <td>
                  <img src={HelpMenuGameMakerIcon} className={classes.helpIcon}  alt="Game Maker Icon" />
                </td>
                <td >
                  <div className={classes.helpName} onClick={()=>handleUpdatedValue()}>Game Maker</div>
                </td>
              </tr>
              <tr className={classes.helpTableRowLine}>
                  <hr style={{height: 1, color:'#768092', backgroundColor:'#768092', width: '100%', border: 0}} />
              </tr>
              <tr className={classes.helpTableRow}>
                <td>
                  <img src={HelpMenuHelpIcon} className={classes.helpIcon}  alt="Help Icon" />
                </td>
                <td >
                  <div className={classes.helpName} onClick={()=>handleUpdatedValue()}>Help</div>
                </td>
              </tr>
              <tr className={classes.helpTableRow}>
                <td>
                  <img src={HelpMenuAppIcon} className={classes.helpIcon}  alt="App iOS Icon" />
                </td>
                <td >
                  <div className={classes.helpName} onClick={()=>handleUpdatedValue()}>Get the iOS App</div>
                </td>
              </tr>
              <tr className={classes.helpTableRow}>
                <td>
                  <img src={HelpMenuAppAndroidIcon} className={classes.helpIcon}  alt="App Android Icon" />
                </td>
                <td >
                  <div className={classes.helpName} onClick={()=>handleUpdatedValue()}>Get the Android App</div>
                </td>
              </tr>
              <tr className={classes.helpTableRowLine}>
                  <hr style={{height: 1, color:'#768092', backgroundColor:'#768092', width: '100%', border: 0}} />
              </tr>
              <tr className={classes.helpTableRow}>
                <td>
                  <img src={HelpMenuAboutIcon} className={classes.helpIcon}  alt="About Icon" />
                </td>
                <td >
                  <div className={classes.helpName} onClick={()=>handleUpdatedValue()}>About RightOn!</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </Collapse>
    </div>
  );
};

const useStyles = (isHelpMenuClicked) => makeStyles(theme => ({
    helpWrapper: {
      color: 'white',
      fontFamily: 'Poppins',
      width: '45px',
      cursor: 'pointer',
      position: 'relative',
    },
    helpHeader: {
      backgroundColor: isHelpMenuClicked ? 'white' : null,
      borderRadius: '0px',
      height: isHelpMenuClicked ? '37px' : '35px',
    },
    helpTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '39px',
      color: '#768092',
      paddingLeft: '16px'
    },
    helpBody: {
      position: 'absolute',
      width: 230,
      right: 0,
      top: '35px',
      paddingBottom: '10px',
      paddingTop: '15px',
      background: 'white',
      borderRadius: '18px',
      borderTopRightRadius: 0,
      boxShadow: '0px 10px 10px rgba(15, 27, 40, 0.13)',
      display: 'flex',
      direction: 'column',
      zIndex: 2,
    },
    helpTableRow: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '8px',
    },
    helpTableRowLine: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px'
    },
    helpName: {
      fontSize: '16px',
      lineHeight: '32px',
      color: '#768092',
      cursor: 'pointer',
    },
    helpMenuTitleIcon:{
      position: 'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      margin: 'auto',
    },
    helpIcon: {
      paddingRight:'8px',
    }
  }));