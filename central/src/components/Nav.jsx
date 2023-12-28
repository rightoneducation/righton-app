import React from 'react';
import { NavLink, useRouteMatch } from "react-router-dom";
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import exploreIcon from '../images/ExploreIcon.svg';
import questionBankIcon from '../images/QuestionBankIcon.svg';
import betaLogo from '../images/BetaLogo.svg';
import quizMakerIcon from '../images/GameMakerIcon.svg';
import helpIcon from '../images/HelpIcon.svg';
import HelpDropdown from './HelpDropdown';
import { BoltRounded } from '@mui/icons-material';

export default function PrimarySearchAppBar({ isResolutionMobile, isUserAuth, handleModalOpen }) {
  const classes = useStyles(isResolutionMobile)();
  const match = useRouteMatch('/gameMaker');

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar}>
        <Toolbar>
          <NavLink exact className={classes.logoContainer} activeClassName={classes.active} id='Logo' to={'/'}>
              <img src={betaLogo} alt="Logo" className={classes.logo} />
          </NavLink>
          <Grid className={classes.container}> 
          {(isResolutionMobile && !match) || !isResolutionMobile ?
            <>
              <NavLink exact className={classes.link} activeClassName={classes.active} id='Explore' to={'/'}>
                <img src={exploreIcon} alt="Explore Icon" className={classes.icon} />
                <Typography className={classes.title} variant="h6">
                  Games
                </Typography>
              </NavLink>
              <NavLink exact className={classes.link} activeClassName={classes.active} id='Explore' to={'/questions'}>
                <img src={questionBankIcon} alt="Explore Icon" className={classes.icon} />
                <Typography className={classes.title} variant="h6">
                  Questions
                </Typography>
              </NavLink>
            </>
            : null }
            {(isUserAuth && isResolutionMobile && match) || (isUserAuth && !isResolutionMobile) ? 
            <>
            <NavLink className={classes.link} activeClassName={classes.active} id='GameMaker' to={'/gamemaker/0'}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
               <Typography className={classes.title} variant="h6" >
                Game Maker
              </Typography> 
            </NavLink>
               <NavLink className={classes.link} activeClassName={classes.active} id='QuestionMaker' to={'/questionmaker/0'}>
               <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
                <Typography className={classes.title} variant="h6" >
                 Question Maker
               </Typography> 
             </NavLink>
            </>
            : null}
            {!isResolutionMobile ?
            <div className={classes.help} id='Help' onClick={() => handleModalOpen(true, false)}>
              <img src={helpIcon} alt="Help Icon" className={classes.icon} />
               <Typography className={classes.helpText} variant="h6" >
                Help
              </Typography>
            </div> 
            :
            <div className={classes.help}>
              <HelpDropdown isUserAuth={isUserAuth} handleModalOpen={handleModalOpen}/>
            </div>
            }
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = (isResolutionMobile) => makeStyles(theme => ({  
  grow: {
    zIndex: 2,
  },
  bar: {
    position: 'sticky',
    background: 'linear-gradient(right,#0F78BD,#043373)',
    paddingTop: '10px',
  },
  container: {
    display: "flex",
    margin:  'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10px',
    gap: 20,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
    opacity: '0.5',
    alignItems: 'center'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: '20px'
  },
  logo: {
    minHeight: !isResolutionMobile ? '60px' : '43px',
    paddingTop: '10%',
    paddingBottom: '10%'
  },
  icon: {
    minWidth: '43px',
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '30px',
    minWidth: '100%',
  },
  help: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'none',
    position: 'absolute',
    right: '20px',
    cursor: 'pointer',
  },
  helpText: {
    color:'white',
    minWidth: '100%',
  },
  active: {
    opacity: '1',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
   paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
    },
  },
}));