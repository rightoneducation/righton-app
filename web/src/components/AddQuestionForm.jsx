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
  }));

function AddQuestionForm({ loading, games, saveGame, saveQuestion, deleteQuestion, deleteGame, cloneGame, questionIndex, gameIndex }) {
    const classes = useStyles();
    const match = useRouteMatch('/games/:gameIndex');
    const history = useHistory();

    console.log(games[0]);
    return (
        <Grid container className={classes.root}>
          <Route>
            <Grid item xs={12} className={classes.sidebar}>
                <h3>Browse Games</h3>
                <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(index) => history.push(`/games/${gameIndex}/questions/${questionIndex}/copy/gameSelected/${index + 1}`)}/>
            </Grid>
          </Route>
          {match && games[Number(match.params.gameIndex) - 1] && (
            <Grid item xs={7} className={classes.content}>
              <Switch>
                <Route exact path="/games/:gameIndex/questions/:questionIndex/copy/gameSelected/:selectedIndex" render={
                  ({ match }) => {
                    const { gameIndex, questionIndex, selectedIndex } = match.params;
                    return <AddQuestion loading={loading} saveGame={saveGame} game={games[Number(selectedIndex-1)]} gameIndex={selectedIndex}/>;
                  }
                } />
              </Switch>
            </Grid>
          )}
        </Grid>
    );
}


export default AddQuestionForm;