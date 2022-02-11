import React from 'react';
import { NavLink, useRouteMatch } from "react-router-dom";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import exploreIcon from './../images/Explore.svg';
import quizMakerIcon from './../images/QuizMaker.svg';
import ComingSoon from './../images/ComingSoon.svg';
import SearchBar from './SearchBar.jsx';

export default function PrimarySearchAppBar({ setSearchInput, searchInput }) {
  const classes = useStyles();
  const matchSearchBar = useRouteMatch('/');
  
  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} style={{paddingTop: '25px'}} position="static">
        <Toolbar>
          <grid style={{display: "flex", margin: 'auto'}}>
            <NavLink className={classes.link} activeClassName={classes.active} id='Explore' to={'/'}>
              <img src={exploreIcon} alt="Explore Icon" className={classes.icon}  />
              <Typography className={classes.title} variant="h6" noWrap>
                Explore
              </Typography>
            </NavLink>
            <img src={ComingSoon} alt="Coming Soon!!" style={{height: 50, marginRight: 50}} />
            <NavLink className={classes.link} activeClassName={classes.active} id='GameMaker' to={'/GameMaker'}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Game Maker
              </Typography>
            </NavLink>
            <img src={ComingSoon} alt="Coming Soon!!" style={{height: 50, marginLeft: 50, marginRight: 20}} />
            {matchSearchBar.isExact ? <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} /> : setSearchInput('')} 
          </grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  bar: {
    background: 'linear-gradient(right,#0F78BD,#043373)',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
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
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
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
  },
}));