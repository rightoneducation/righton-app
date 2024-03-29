import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Tooltip } from '@material-ui/core';
import HelpMenuIcon from '../images/HelpMenuIcon.svg';
import HelpMenuIconClicked from '../images/HelpMenuIconClicked.svg';
import HelpMenuExploreIcon from '../images/HelpMenuExploreIcon.svg';
import HelpMenuGameMakerIcon from '../images/HelpMenuGameMakerIcon.svg';
import HelpMenuHelpIcon from '../images/HelpMenuHelpIcon.svg';
import HelpMenuAppIcon from '../images/HelpMenuAppIcon.svg';
import HelpMenuAppAndroidIcon from '../images/HelpMenuAppAndroidIcon.svg';
import HelpMenuAboutIcon from '../images/HelpMenuAboutIcon.svg';

export default function HelpDropdown({isUserAuth, handleModalOpen}) {
  const [isHelpMenuClicked, SetIsHelpMenuClicked] = React.useState(false);
  const [qcValue, setQCValue] = React.useState("");
  const [gradeValue, setGradeValue] = React.useState("");

  const classes = useStyles(isHelpMenuClicked)();
  const history = useHistory();

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
              <tr className={classes.helpTableRow} onClick={() => {SetIsHelpMenuClicked((prev) => !prev); history.push(`/`)}}>
                    <td>
                      <img src={HelpMenuExploreIcon} className={classes.helpIcon}  alt="Explore Icon" />
                    </td>
                    <td >
                      <div className={classes.helpName}>Explore</div>
                    </td>
              </tr>
              {isUserAuth ?
              <tr className={classes.helpTableRow} onClick={() => {SetIsHelpMenuClicked((prev) => !prev); history.push(`/gamemaker/0`)}}>
                <td>
                  <img src={HelpMenuGameMakerIcon} className={classes.helpIcon}  alt="Game Maker Icon" />
                </td>
                <td >
                  <div className={classes.helpName}>Game Maker</div>
                </td>
              </tr> : null}
              <tr className={classes.helpTableRowLine}>
                <td width='100%'>
                  <hr style={{height: 1, color:'#768092', backgroundColor:'#768092', width: '100%', border: 0}} />
                </td>
              </tr>
              <tr className={classes.helpTableRow} onClick={() => {SetIsHelpMenuClicked((prev) => !prev); handleModalOpen(true, false)}}>
                <td>
                  <img src={HelpMenuHelpIcon} className={classes.helpIcon}  alt="Help Icon" />
                </td>
                <td >
                  <div className={classes.helpName}>Help</div>
                </td>
              </tr>
              <tr className={classes.helpTableRow} onClick={() => {SetIsHelpMenuClicked((prev) => !prev); handleModalOpen(true, true)}}>
                <td>
                  <img src={HelpMenuAppIcon} className={classes.helpIcon}  alt="App Icon" />
                </td>
                <td >
                  <div className={classes.helpName}>Get the App</div>
                </td>
              </tr>
              <tr className={classes.helpTableRowLine}>
                <td width='100%'>
                  <hr style={{height: 1, color:'#768092', backgroundColor:'#768092', width: '100%', border: 0}} />
                </td>
              </tr>
              <tr className={classes.helpTableRow} onClick={() => {SetIsHelpMenuClicked((prev) => !prev); window.location = `//www.rightoneducation.com/`}}>
                <td>
                  <img src={HelpMenuAboutIcon} className={classes.helpIcon}  alt="About Icon" />
                </td>
                <td >
                  <div className={classes.helpName}>About RightOn!</div>
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
      zIndex: 5
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
      zIndex: 5,
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