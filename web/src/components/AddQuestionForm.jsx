import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import GameDashboard from './GameDashboard';
import { Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import GameForm from "./GameForm";
import AddQuestion from "./AddQuestion";



const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
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
  }
  }));

function AddQuestionForm({ loading, games, saveGame, saveQuestion, deleteQuestion, deleteGame, cloneGame, addQuestion }) {
    const classes = useStyles();
    const history = useHistory();
    const selectedIndex = window.location.pathname.split('/')[3];
    const index = window.location.pathname.split('/')[5];

    return (
        <Grid container className={classes.root}>
          <Grid item xs={5} className={classes.sidebar}>
            <h3>Browse Games</h3>
            <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(index) => history.push(`/gamemaker/addquestion/gameSelected/${index + 1}`)}/>
          </Grid>
          <Grid item xs={7} className={classes.content}>
            <Switch>
              <Route exact path="/gamemaker/addquestion" render={
                ({}) => {
                  return (
                    <Grid style={{height: 'calc(100vh - 64px)'}}>
                      <p style={{color:"#797979", fontWeight:"bold"}}>No Game Selected</p>
                      <h2 style={{width: "60%",color:"#797979", marginLeft:"auto", marginRight:"auto", marginTop:"30%"}}>In order to view questions, you must select a game from the section on the left</h2>
                    </Grid>
                  );
                }
              }/>
              <Route path="/gamemaker/addquestion/gameSelected/:selectedIndex" render={
                ({ match }) => {
                  const { questionIndex, selectedIndex, gameIndex} = match.params;
                  return <AddQuestion loading={loading} deleteQuestion={deleteQuestion} saveGame={saveGame} game={games[Number(selectedIndex-1)]} selectedIndex={selectedIndex} questionIndex={questionIndex} gameIndex={gameIndex}/>;
                }
              } />
            </Switch>
            <Grid className={classes.parent}>
              <button className={classes.greenButton} onClick={() => addQuestion(games[Number(selectedIndex)].questions[index])}>Add to Game</button>
              <button className={classes.blueButton}>Clone and Edit</button>
              <button className={classes.redButton} >View Question</button>
            </Grid>
          </Grid>
        </Grid>
    );
}


export default AddQuestionForm;