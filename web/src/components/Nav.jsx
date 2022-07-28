import React from 'react';
<<<<<<< HEAD
import { NavLink, useRouteMatch } from "react-router-dom";
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import exploreIcon from '../images/Explore.svg';
import quizMakerIcon from '../images/QuizMaker.svg';
import SearchBar from './SearchBar.jsx';

export default function PrimarySearchAppBar({ setSearchInput, searchInput, isUserAuth }) {
  const classes = useStyles();
  const matchSearchBar = useRouteMatch('/');
  
  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} style={{paddingTop: '25px'}} position="static">
        <Toolbar>
        {isUserAuth && (
          <Grid style={{display: "flex", margin: 'auto'}}>
            <NavLink exact className={classes.link} activeClassName={classes.active} id='Explore' to={'/'}>
              <img src={exploreIcon} alt="Explore Icon" className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Explore
              </Typography>
            </NavLink>
            <NavLink className={classes.link} activeClassName={classes.active} id='GameMaker' to={'/gamemaker/0'}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Game Maker
              </Typography>
            </NavLink>
            {/* <img src={ComingSoon} alt="Coming Soon!!" style={{height: 50, marginLeft: 50, marginRight: 20}} /> */}
            {matchSearchBar.isExact ? <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} /> : setSearchInput('')} 
          </Grid>
          )}
=======
import {
  Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function PrimarySearchAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} position="static">
        <Toolbar>
          <Link className={classes.link} to={'/'}>
            <Typography className={classes.title} variant="h6" noWrap>
              RightOn Game Builder
            </Typography>
          </Link>
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
<<<<<<< HEAD
  bar: {
    background: 'linear-gradient(right,#0F78BD,#043373)',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
=======
  grow: {
    flexGrow: 1,
    marginBottom: '1px',
  },
  title: {
    display: 'none',
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
<<<<<<< HEAD
    width: '190px',
    display: 'flex',
    opacity: '0.5',
  },
  icon: {
    height: '80%',
    marginRight: 10,
  },
  active: {
    opacity: '1',
  },
  search: {
    position: 'absolute',
    right: 0,
    borderRadius: '20px',
    border: '3px solid #87B8DB',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 20,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    display: 'inline-block',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    paddingLeft: '6px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#87B8DB'
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
=======
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  },
}));