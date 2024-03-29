import React from "react";
import { Route, Switch, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from "@material-ui/core";
import ArrowBack from '@material-ui/icons/ArrowBack';
import QuestionDashboard from './QuestionDashboard';

export default function AddQuestionForm({ loading, questions, games, cloneQuestion, submit, gameId }) {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Grid container className={classes.root}>
          <Button type="button" className={classes.back} onClick={() => history.push(`/gamemaker/${gameId}`)}>
            <ArrowBack style={{marginRight: 8}} />Back to Game Maker
          </Button>

          <Grid item xs={12} className={classes.sidebar}>
            <QuestionDashboard questions={questions} />
          </Grid>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: '100%'
  },
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  parent: {
    marginTop:"auto", 
    display:"felx", 
    justifyContent:"space-between",
    textAlign: "center",
  },
  blueButton: {
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%);',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
  greenButton: {
      background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
      borderRadius: '50px',
      textTransform: 'none',
      fontSize: '17px',
      fontWeight: 500,
      color: 'white',
  },
  redButton: {
    background: 'linear-gradient(90deg, #E2215D 0%, #FC2164 100%)',
      borderRadius: '50px',
      textTransform: 'none',
      fontSize: '17px',
      fontWeight: 500,
      color: 'white',
  },
  back: {
    position: 'absolute',
    top: 100,
    left: 0,
    paddingBottom: 10
  },
  }));