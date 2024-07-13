import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Button,
} from '@material-ui/core';
import { AddBox, IndeterminateCheckBox } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  questionStyle: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: '10px',
    padding: '20px 20px 20px 20px',
  },
  questionCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    width: '100%',
    borderRadius: '18px',
  },
  expand: {
    display: 'flex',
    width: '100%',
    height: '50px',
    padding: '0px',
    float: 'bottom',
    color: '#1C55FD',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    margin: 'auto',
    maxWidth: '500px',
    paddingBottom: '24px',
    boxSizing: 'border-box',
  },
  expandButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0px',
    background: '#F4F4F4',
  },
  image: {
    width: '100%',
    height: 'auto',
    padding: 0,
  },
}));

export default function QuestionCard({ question, image }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [stat, setStat] = useState(0);
  const hideaway = ['Show More', 'Show Less'];
  const box = [<AddBox />, <IndeterminateCheckBox />];

  const handleExpandClick = () => {
    if (expanded === true) {
      setStat(0);
    }
    if (expanded === false) {
      setStat(1);
    }
    setExpanded(!expanded);
  };

  return (
    <Grid container className={classes.centerContent} style= {{paddingBottom: '0px'}}>
      <Card
        className={classes.questionCard}
        style={{ width: '100%', borderRadius: '18px', padding: 0 }}
      >
        <CardContent className={classes.content}>
          <Typography className={classes.questionStyle}>{question}</Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.content}>
            <img src={image} alt="" className={classes.image} />
          </CardContent>
        </Collapse>
        <CardActions disableSpacing className={classes.expandButton}>
          <Button
            className={classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <p className={classes.centerContent}>
              {box[stat]}
              {hideaway[stat]}
            </p>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
