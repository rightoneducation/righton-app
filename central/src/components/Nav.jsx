import React from 'react';
import { NavLink, useRouteMatch } from "react-router-dom";
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import exploreIcon from '../images/ExploreIcon.svg';
import betaLogo from '../images/BetaLogo.svg';
import quizMakerIcon from '../images/GameMakerIcon.svg';
import helpIcon from '../images/HelpIcon.svg';
import SearchBar from './SearchBar.jsx';
import { BoltRounded } from '@mui/icons-material';

export default function PrimarySearchAppBar({ setSearchInput, searchInput, isUserAuth, isResolutionMobile, handleSearchClick, isSearchClick, handleModalOpen }) {
  const classes = useStyles(isResolutionMobile)();

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} style={{paddingTop: '10px'}} position="static">
        <Toolbar>
          <NavLink exact className={classes.logoContainer} activeClassName={classes.active} id='Explore' to={'/'}>
              <img src={betaLogo} alt="Logo" className={classes.logo} />
          </NavLink>
          <Grid className={classes.container}> 
            <NavLink exact className={classes.link} activeClassName={classes.active} id='Explore' to={'/'}>
              <img src={exploreIcon} alt="Explore Icon" className={classes.icon} />
              { !isResolutionMobile ? <Typography className={classes.title} variant="h6" noWrap>
                Explore
              </Typography> : null }
            </NavLink>
            { isUserAuth ? 
            <NavLink className={classes.link} activeClassName={classes.active} id='GameMaker' to={'/gamemaker/0'}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.iconQuiz} />
              {!isResolutionMobile ? <Typography className={classes.title} variant="h6" noWrap>
                Game Maker
              </Typography> : null}
            </NavLink> : null }
            <div className={classes.help} type="button" onClick={() => handleModalOpen()}>
              <img src={helpIcon} alt="Help Icon" className={classes.icon} />
              { !isResolutionMobile ? <Typography className={classes.helpText} variant="h6" noWrap>
                Help
              </Typography>:null }
            </div>
            {/* {matchSearchBar.isExact ? 
               <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} isResolutionMobile={isResolutionMobile} isSearchClick={isSearchClick} handleSearchClick={handleSearchClick}/> 
              : setSearchInput('')}  */}
          </Grid>

        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = (isResolutionMobile) => makeStyles(theme => ({
  bar: {
    background: 'linear-gradient(right,#0F78BD,#043373)',
  },
  grow: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    margin: !isResolutionMobile ? 'auto' : '',
    alignItems: 'center',
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '30px'
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
  },
  logo: {
    minHeight: '60px',
    paddingTop: '10%',
    paddingBottom: '10%'
  },
  icon: {
    width: '70%',
    marginRight: 10,
  },
  iconQuiz: {
    width: '70%',
    marginRight: 10,
  },
  help: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    textTransform: 'none'
  },
  helpText: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color:'white'
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