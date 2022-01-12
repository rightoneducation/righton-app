import React from 'react';
import {
  NavLink
} from "react-router-dom";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import exploreIcon from './../images/Explore.svg';
import quizMakerIcon from './../images/QuizMaker.svg';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { SORT_TYPES } from '../lib/sorting';

export default function PrimarySearchAppBar({ setSearchInput, searchInput, sortType, setSortType }) {
  const classes = useStyles();

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

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
          <div className={classes.sortSelect}>
            <Select
              value={sortType}
              onChange={handleSortChange}
              label="Filter"
              style={{margin: 'auto'}}
            >
              <MenuItem value={SORT_TYPES.UPDATED}>Last Updated</MenuItem>
              <MenuItem value={SORT_TYPES.ALPHABETICAL}>Alphabetical</MenuItem>
            </Select>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search games…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={searchInput}
              onChange={({ target }) => setSearchInput(target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
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
  sortSelect: {
    position: 'absolute',
    display: 'inline-block',
    padding: '6px',
    // width: 140,
    right: 260,
    backgroundColor: 'white',
    borderRadius: '18px',
    boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
    textAlign: 'center'
  },
}));