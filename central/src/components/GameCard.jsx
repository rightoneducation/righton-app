import React from 'react';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Menu, 
  MenuItem
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CCSS from './CCSS';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
export default function GameCard({ 
  game,
  index,
  handleClick,
  handleClose,
  cloneHandler,
  deleteHandler,
  addquestion,
  match,
  isUserAuth,
  onClick,
  anchorEl,
  activeIndex
 }) {
  const classes = useStyles();
  const { id, title, description, cluster, domain, grade, standard, imageUrl } = game;
  const questionCount = game?.questionTemplates?.length || 0;
  const history = useHistory();
    return (
      <Card className={classnames(classes.game, !match && classes.gameGrid, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={id} onClick={onClick}>
        <CardContent>
          <Grid container>
            <Grid container item xs={8} md={9} >
              <div className={classes.cardText}>
                <Grid container>
                  <Grid item xs={5}> 
                    <CCSS grade={grade} domain={domain} cluster={cluster} standard={standard} />
                  </Grid>
                  <Grid item md={7}>
                    <Typography className={classes.question}>
                      {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : null}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography className={classes.title} >
                  {title}
                </Typography>
                <Typography className={classes.textSecondary} color="textSecondary" >
                  {description}
                </Typography>
              </div>
            </Grid>

            <Grid container className={classes.imageButton} item xs={4} md={3}>
              <Grid item xs={10} >
                <div className={classes.imageContainer}>
                  {imageUrl ? <img className={classes.image} src={imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" className={classes.image} />}
                </div>
              </Grid>
              { isUserAuth && 
                <Grid item xs={2} className={addquestion ? classes.hide : classes.show}>
                  <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.moreButton} data-game-index={index}>
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    id={`question-${index}-actions`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={activeIndex === String(index)}
                    onClose={handleClose}
                    onClick={(event) => { if (!match) event.stopPropagation(); }}
                  >
                    <MenuItem onClick={(event) => { history.push(`/gamemaker/${game.id}`); event.stopPropagation(); handleClose(); }}>Edit</MenuItem>
                    <MenuItem onClick={cloneHandler(game)}>Clone</MenuItem>
                    <MenuItem onClick={deleteHandler(id)}>Delete</MenuItem>
                  </Menu>             
                </Grid>
              }
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
    marginRight: '5px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      boxShadow: '1px 4px 12px grey',
      cursor: 'pointer',
    },
    height: '152px',
    boxShadow: '1px 4px 8px lightgrey',
    zIndex: 2
  },
  gameGrid: {
    display: 'inline-block',
    marginRight: theme.spacing(2),
    verticalAlign: 'top',
  },
  gameSelected: {
    backgroundColor: '#CAF0F3',
    '&:hover': {
      backgroundColor: '#CAF0F3',
      cursor: 'default',
    }
  },
  cardText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    overflow: 'hidden'
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
  question: {
    fontWeight: 700,
    color: '#159EFA',
    textAlign: 'right',
    marginRight: '15px',
    width: '90%',
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
  show: {
    display: 'block'
  },
  hide: {
    display: 'none'
  },
  moreButton: {
    minWidth: '28px',
    margin: '0',
  },
}));
