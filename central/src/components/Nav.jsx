import React from 'react';
import { NavLink, useRouteMatch, useHistory } from "react-router-dom";
import { alpha, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import exploreIcon from '../images/ExploreIcon.svg';
import questionBankIcon from '../images/QuestionBankIcon.svg';
import betaLogo from '../images/BetaLogo.svg';
import quizMakerIcon from '../images/GameMakerIcon.svg';
import helpIcon from '../images/HelpIcon.svg';
import HelpDropdown from './HelpDropdown';
import { v4 as uuidv4 } from 'uuid';

export default function PrimarySearchAppBar({ isResolutionMobile, isUserAuth, handleModalOpen, setIsNewGame }) {
  const classes = useStyles(isResolutionMobile)();
  const history = useHistory();
  const match = useRouteMatch('/gameMaker');
  const gameId = uuidv4();
  const handleGameMakerNavigate = () => {
    setIsNewGame(true);
    history.push(`/gamemaker/${gameId}`);
  }

  return (
    <div className={classes.grow}>
      <Box className={classes.bar}>
        <NavLink exact className={classes.logoContainer} activeClassName={classes.active} id='Logo' to={'/'}>
            <img src={betaLogo} alt="Logo" className={classes.logo} />
        </NavLink>
        <Box className={classes.container}> 
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
            <Box className={classes.link} id='GameMaker' onClick={handleGameMakerNavigate}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
              <Typography className={classes.title} variant="h6" >
                Game Maker
              </Typography> 
            </Box>
              <NavLink className={classes.link} activeClassName={classes.active} id='QuestionMaker' to={`/questionmaker/${gameId}`}>
              <img src={quizMakerIcon} alt="Quiz Maker Icon" className={classes.icon} />
                <Typography className={classes.title} variant="h6" >
                Question Maker
              </Typography> 
            </NavLink>
            </>
            : null}
        </Box>
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
      </Box>
    </div>
  );
}

const useStyles = (isResolutionMobile) => makeStyles(theme => ({  
  grow: {
    width: '100%',
    zIndex: 1,
  },
  bar: {
    position: 'sticky',
    background: 'linear-gradient(right,#0F78BD,#043373)',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',

  },
  container: {
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: '10px'
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
    opacity: '0.5',
    alignItems: 'center',
    paddingLeft: '10px',
    cursor: 'pointer'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px'
  },
  logo: {
    minHeight: !isResolutionMobile ? '60px' : '43px',
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
    color: 'white'
  },
  help: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'none',
    cursor: 'pointer',
    paddingRight: '10px',
    paddingBottom: '10px'
  },
  helpText: {
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