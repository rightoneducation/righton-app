import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import GameDashboard from './GameDashboard';
import { Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import GameForm from "./GameForm";
import AddQuestion from "./AddQuestion";



const useStyles = makeStyles(theme => ({
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
    },
  rightSideButton: {
    
  },
  }));

function AddQuestionForm({ loading, games, saveGame, saveQuestion, deleteQuestion, deleteGame, cloneGame, questionIndex, gameIndex }) {
    const classes = useStyles();
    const match = useRouteMatch('/games/:gameIndex');
    const history = useHistory();

    console.log(games[0]);
    return (
        <Grid container className={classes.root}>
          <Route>
            <Grid item xs={6} className={classes.sidebar}>
                <h3>Browse Games</h3>
                <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(index) => history.push(`/games/${gameIndex}/questions/${questionIndex}/copy/gameSelected/${index + 1}`)}/>
            </Grid>
          </Route>
          {match && games[Number(match.params.gameIndex) - 1] && (
            <Grid item xs={6} className={classes.content}>
              <Switch>
                <Route exact path="/games/:gameIndex/questions/:questionIndex/copy" render={
                  ({}) => {
                    return (
                      <Grid style={{height: 'calc(100vh - 64px)'}}>
                        <p style={{color:"#797979", fontWeight:"bold"}}>No Game Selected</p>
                        <h2 style={{width: "60%",color:"#797979", marginLeft:"auto", marginRight:"auto", marginTop:"30%"}}>In order to view questions, you must select a game from the section on the left</h2>
                      </Grid>
                    );
                  }
                }/>
                <Route exact path="/games/:gameIndex/questions/:questionIndex/copy/gameSelected/:selectedIndex" render={
                  ({ match }) => {
                    const { questionIndex, selectedIndex, gameIndex} = match.params;
                    return <AddQuestion loading={loading} deleteQuestion={deleteQuestion} saveGame={saveGame} game={games[Number(selectedIndex-1)]} selectedIndex={selectedIndex} questionIndex={questionIndex} gameIndex={gameIndex}/>;
                  }
                } />
              </Switch>
              <Grid style={{marginTop:"auto", display:"felx"}}>
                <button className="rightSideButton">Add to Game</button>
                <button className="rightSideButton">Clone and Edit</button>
                <button className="rightSideButton">View Question</button>
              </Grid>
            </Grid>
          )}
        </Grid>
    );
}


export default AddQuestionForm;