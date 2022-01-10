import React from 'react';
import {
  NavLink
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import exploreIcon from './../images/Explore.svg';
import quizMakerIcon from './../images/QuizMaker.svg';

export default function PrimarySearchAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} position="static">
        <p style={{color: 'black', margin: 'auto', marginLeft: '0'}}>Teacher / ExploreChromebook </p>
        <Toolbar>
          <grid>
          </grid>
          <grid style={{display: "flex", margin: 'auto'}}>
            <NavLink className={classes.link} activeClassName={classes.active} id='Explore' to={'/'}>
              <img src={exploreIcon} className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Explore
              </Typography>
            </NavLink>
            <NavLink className={classes.link} activeClassName={classes.active} id='GameMaker' to={'/GameMaker'}>
              <img src={quizMakerIcon} className={classes.icon} />
              <Typography className={classes.title} variant="h6" noWrap>
                Game Maker
              </Typography>
            </NavLink>
          </grid>
          <grid>
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
    width: '150px',
    display: 'flex',
    opacity: '0.5',
  },
  icon: {
    height: '80%',
  },
  active: {
    opacity: '1',
  }
}));