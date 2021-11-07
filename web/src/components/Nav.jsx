import React from 'react';
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
        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    marginBottom: '1px',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));