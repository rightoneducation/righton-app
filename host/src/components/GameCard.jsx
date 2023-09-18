import React from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const gameCCSS = '7. RP. A. 3';

const GameCard = ({ questions, title }) => {
  const classes = useStyles();
  return (
    <Grid container item xs={12}>
      <Card className={classes.gameCard}>
        <CardContent>
          <Grid container>
            <Grid container item xs={8}>
              <Grid item xs={7}>
                <Typography className={classes.ccss}>{gameCCSS}</Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography className={classes.questionCount}>
                  {(questions ? questions.length : 0) + ' questions'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography className={classes.gameTitle} gutterBottom>
                  {title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
const useStyles = makeStyles((theme) => ({
  gameCard: {
    height: '95px',
    width: '311px',
    borderRadius: '18px',
    margin: 'auto',
  },

  gameTitle: {
    color: 'rgba(56, 68, 102, 1)',
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '21px',
    lineHeight: '100%',
    verticalAlign: 'Top',
    marginTop: '7px',
    fontStyle: 'normal',
  },

  questionCount: {
    fontWeight: 'bold',
    color: 'rgba(155, 169, 208, 1)',
    textAlign: 'right',
    fontFamily: 'Poppins',
    fontStyle: 'Bold',
    fontSize: '12px',
    lineHeight: '18px',
    lineHeight: '100%',
    marginTop: '7px',
    marginRight: '-120%',
  },

  ccss: {
    fontWeight: '700',
    color: 'rgba(155, 169, 208, 1)',
    textAlign: 'right',
    fontFamily: 'Poppins',
    fontStyle: 'Bold',
    fontSize: '12px',
    lineHeight: '18px',
    lineHeight: '100%',
    textAlign: 'left',
    marginTop: '7px',
  },
}));

export default GameCard;
