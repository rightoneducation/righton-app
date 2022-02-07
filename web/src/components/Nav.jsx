import React, { useState } from 'react';
import {
  NavLink
} from "react-router-dom";
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
   const [showSB, setShowSB] = useState(true);

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} style={{paddingTop: '25px'}} position="static">
        <Toolbar>
          <grid style={{display: "flex", margin: 'auto'}}>
             <NavLink className={classes.link} activeClassName={classes.active} id='Explore' to={'/'} onClick={() => setShowSB(true)}> 
              <img src={exploreIcon} alt="Explore Icon" className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Explore
              </Typography>
            </NavLink>
            <img src={ComingSoon} alt="Coming Soon!!" style={{height: 50, marginRight: 50}} />
            <NavLink className={classes.link} activeClassName={classes.active} id='GameMaker' to={'/GameMaker'} onClick={() => setShowSB(false)}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Game Maker
              </Typography>
            </NavLink>
            <img src={ComingSoon} alt="Coming Soon!!" style={{height: 50, marginLeft: 50, marginRight: 20}} />
          </grid>
          { showSB
             ? <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} /> 
            : null }
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
}));