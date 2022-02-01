import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import GameDashboard from './GameDashboard';
import { Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import GameForm from "./GameForm";

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import classnames from 'classnames';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import CCSS from './CCSS';
import QuestionForm from './QuestionForm';


const useStyles = makeStyles(theme => ({
    sidebar: {
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
        borderRight: '1px #0000003b solid',
        height: 'calc(100vh - 64px)',
        overflowY: 'scroll',
      },
  }));

function AddQuestionForm({ loading, games, saveGame, saveQuestion, deleteQuestion }) {
    const classes = useStyles();
    const match = useRouteMatch('/games/:gameIndex');
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const handleClose = () => {
        setAnchorEl(null);
        setActiveIndex(null);
    };


    const renderGames = (loading) => {
        if (loading) return <Typography gutterBottom>Loading...</Typography>;
        if (games.length >= 1) {
          return games
            .map((game, index) => {
              const { id, title } = game;
              const questionCount = game?.questions?.length || 0;
              //const image = getGameImage(game); // figure out what this function does/ should do
              const image = null;
              return (
                <Card className={classnames(classes.game, !match && classes.gameGrid, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={id} onClick={() => history.push(`/games/${index + 1}/questions/copy`)}>
                  <CardContent>
                    <Box className={classes.titleRow}>
                      <Typography className={classes.title} gutterBottom>
                        {title}
                      </Typography>
                    </Box>
    
                    <Box className={classes.gameCardBox}>
                      {image ? <img className={classes.image} src={image} alt="" /> : (
                        <Avatar variant="square" className={classes.square}>
                          <ImageIcon fontSize="large" />
                        </Avatar>
                      )}
                    </Box>
                    <Box className={classes.gameCardBox}>
                      <Typography color="textSecondary" gutterBottom>
                        {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : ''}
                      </Typography>
                      <CCSS game={game} />
                    </Box>
                  </CardContent>
                </Card>
              );
            });
        }
        return (
          <Typography>
            No results found.
          </Typography>
        );
      }
    
    return (
        // <Grid container className={classes.root}>
        //     <Grid item xs={6}>
        //         <h3>Browse Games</h3>
        //         <GameDashboard loading={loading} games={games} saveGame={saveGame} saveQuestion={saveQuestion} deleteGame={deleteGame} cloneGame={cloneGame}/>
        //     </Grid>
        //     {match && games[Number(match.params.gameIndex) - 1] && (
        //         <Grid item xs={6} className={classes.content}>
        //             <Switch>
        //                 <Route exact path="/games/:gameIndex" render={
        //                 ({ match }) => {
        //                     const { gameIndex } = match.params;
        //                     return <GameForm loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
        //                 }
        //                 } />
        //             </Switch>
        //         </Grid>
        //     )}
        // </Grid>
        <Grid container className={classes.root} spacing={4}>
            <Grid item xs={match ? 5 : 12} className={classes.sidebar}>
            {renderGames(loading)}
            </Grid>
            {match && games[Number(match.params.gameIndex) - 1] && (
                <Grid item xs={9} className={classes.content}>
                    <Switch>
                    <Route path="/games/:gameIndex/questions/:questionIndex" render={
                        ({ match }) => {
                            const { questionIndex, gameIndex } = match.params;
                            return <QuestionForm loading={loading} saveQuestion={saveQuestion} gameId={games[Number(match.params.gameIndex) - 1].id} question={games[Number(gameIndex) - 1].questions[questionIndex]} {...match.params} />;
                        }
                    } />
                    <Route path="/games/:gameIndex" render={
                        ({ match }) => {
                            const { gameIndex } = match.params;
                            return <GameForm loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
                        }
                    } />
                    </Switch>
                </Grid>
            )}
        </Grid>
    );
}


export default AddQuestionForm;