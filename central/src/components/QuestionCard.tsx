import React from 'react';
import { Card, CardContent, Grid, Typography, Button, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IQuestionTemplate, IGameTemplate } from '@righton/networking';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
import CCSS from './CCSS';

type QuestionCardProps = {
  id: string;
  title?: string | null;
  owner?: string | null;
  version?: number | null;
  choices?: string | null;
  instructions?: string | null;
  domain: string | null;
  cluster: string | null;
  grade: string | null;
  standard: string | null;
  imageUrl?: string | null;
  gameTemplates?: IGameTemplate[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export default function QuestionCard({
  id,
  title,
  owner,
  version,
  choices,
  instructions,
  domain,
  cluster,
  grade,
  standard,
  imageUrl,
  gameTemplates,
  createdAt,
  updatedAt,
} : QuestionCardProps) {
  const classes = useStyles();
  const gameCount = gameTemplates ? gameTemplates.length : 0;
return (
  <Card className={classes.game}>
    <CardContent>
      <Grid container>
        <Grid container item xs={8} md={9} >
          <div className={classes.cardText}>
            <Grid container>
              <Grid item xs={5}> 
                <CCSS grade={grade ?? ''} domain={domain ?? ''} cluster={cluster ?? ''} standard={standard ?? ''} />
              </Grid>
              <Grid item md={7}>
                <Typography className={classes.question}>
                  Used in {gameCount} Game{gameCount > 1 || gameCount === 0 ? 's' : null}
                </Typography>
              </Grid>
            </Grid>
            <Typography className={classes.title} >
              {title}
            </Typography>
            <Typography className={classes.textSecondary} color="textSecondary" >
              {instructions}
            </Typography>
          </div>
        </Grid>
        <Grid container item xs={4} md={3}>
          <Grid item xs={10} >
            <div className={classes.imageContainer}>
              {imageUrl ? <img className={classes.image} src={imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" className={classes.image} />}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
}


const useStyles = makeStyles(theme => ({
    game: {
      width: '100%',
      borderRadius: '10px',
      marginBottom: theme.spacing(2),
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        boxShadow: '1px 4px 12px grey',
        cursor: 'pointer',
      },
      height: '152px',
      boxShadow: '1px 4px 8px lightgrey',
      display: 'inline-block',
      marginRight: theme.spacing(2),
      verticalAlign: 'top',
    },
    cardText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      overflow: 'hidden'
    },
    question: {
      fontWeight: 700,
      color: '#159EFA',
      textAlign: 'right',
      marginRight: '15px',
      width: '90%',
    },
    title: {
      fontWeight: 700,
      height: '80%',
      color: '#384466',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '95%',
    },
    textSecondary: {
      height: '90%',
      maxWidth: '90%',
      paddingRight: '5px',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    image: {
      width: '110px',
      height: '110px',
      objectFit: 'cover',
      borderWidth: '0',
      borderRadius: '15px',
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center',
      paddingTop:'5px',
    },
  })
)