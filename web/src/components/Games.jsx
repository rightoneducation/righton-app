import React from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import GameForm from './GameForm';

export default function Games({ games, saveGame }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');

  return (
    <Grid container className={classes.root} spacing={4}>
      <Grid item xs={3} className={classes.sidebar}>
        <Box className={classes.actions}>
          <Button variant="contained" color="primary" onClick={() => history.push(`/games/${games.length + 1}`)} disabled={!!match}>
            Add game
          </Button>
        </Box>
        {games.map(({ GameID, title, grade, q1, q2, q3, q4, q5 }, index) => {
          const questionCount = [q1, q2, q3, q4, q5].filter(q => !!q).length;
          return (
            <Card className={classes.game} key={GameID}>
              <CardContent>
                <Typography gutterBottom>
                  {title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : ''}{grade && ` — Grade ${grade}`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => history.push(`/games/${index + 1}`)}>Edit</Button>
              </CardActions>
            </Card>
          );
        })}
      </Grid>
      <Grid item xs={9} className={classes.content}>
        <Route path="/games/:gameIndex" render={
          ({ match }) => {
            const { gameIndex } = match.params;
            return <GameForm saveGame={saveGame} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
          }
        } />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  game: {
    marginBottom: theme.spacing(2),
  },
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
  },
  content: {
    minHeight: 'calc(100vh - 72px)',
  },
  actions: {
    marginBottom: '16px',
  },
}));
