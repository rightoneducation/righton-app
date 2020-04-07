import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default function Games({ games }) {
  const classes = useStyles();
  const history = useHistory();
  // TODO: get the grid to line up with the navbar?
  return (
    <Box className={classes.page}>
      <Grid container spacing={3}>
        <Grid item xs={3} className={classes.sidebar}>
          <Box className={classes.actions}>
            <Button variant="contained" color="primary" onClick={() => history.push('/games/new')}>
              Add game
          </Button>
          </Box>
          {games.map(({ GameID, title }, index) => (
            <Card key={GameID}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {title}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => history.push(`/games/${index}`)}>Edit</Button>
              </CardActions>
            </Card>
          ))}
        </Grid>
        <Grid item xs={9} className={classes.content}>
          {/* TODO: replace with game fields, and question list */}
          {/* TODO: add question button */}
        </Grid>
      </Grid>
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  sidebar: {
    borderRight: '1px black solid',
    // padding: '16px 8px',
  },
  content: {
    // padding: '16px 8px',
  },
  actions: {
    marginBottom: '16px',
  },
  page: {
    position: 'fixed',
    top: '64px',
    bototm: 0,
    left: 0,
    right: 0,
    flexGrow: 1,
  },
}));
