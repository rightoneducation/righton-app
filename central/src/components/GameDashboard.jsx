import React, { useState } from 'react';
import classnames from 'classnames';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CCSS from './CCSS';

export default function GameDashboard({ loading, games, deleteGame, cloneGame, gameId, onClickGame }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');
  const addquestion = useRouteMatch('/gamemaker/:gameId/addquestion');
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setActiveIndex(event.currentTarget.dataset.gameIndex);
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveIndex(null);
  };
  const cloneHandler = (game) => () => {
    const newGame = {
      cluster: game.cluster,
      description: game.description,
      domain: game.domain,
      grade: game.grade,
      questions: game.questions,
      standard: game.standard,
      title: `Clone of ${game.title}`,
    };
    cloneGame(newGame).then((index) => {
      if (index > -1) history.push(`/games/${index + 1}`);
    });
    handleClose();
  };
  const deleteHandler = (id) => () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this game?');
    if (confirmDelete) {
      deleteGame(id);
    }
    handleClose();
  };

  const renderGames = (loading) => {
    if (loading) return <Typography gutterBottom>Loading...</Typography>;
    if (games.length >= 1) {
      return games
        .map((game, index) => {
          const { id, title, description, cluster, domain, grade, standard, imageUrl } = game;
          const questionCount = game?.questions?.length || 0;
          
          return (
            <Grid key={index} container item xs={12} md={addquestion ? 12 : 6} lg={addquestion ? 12 : 4}>
              <Card className={classnames(classes.game, !match && classes.gameGrid, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={id} onClick={() => onClickGame(game.id, gameId)}>
                <CardContent>
                  <Grid container>
                    <Grid container item xs={9}>
                      <Grid item xs={7}>
                        <CCSS grade={grade} domain={domain} cluster={cluster} standard={standard} />
                      </Grid>

                      <Grid item xs={5}>
                        <Typography className={classes.question}>
                          {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : ''}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography className={classes.title} gutterBottom>
                        {title}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography color="textSecondary" gutterBottom>
                          {description}
                        </Typography>
                      </Grid>

                      {/* Post MVP Feature - Author of Games
                      <Grid item xs={12}>
                        <Typography color="textSecondary" gutterBottom>
                          By: RightOn! Education
                        </Typography>
                      </Grid> */}
                    </Grid>

                    <Grid container item xs={3}>
                      <Grid item xs={10}>
                        {imageUrl ? <img className={classes.image} src={imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" height={'125px'}/>}
                      </Grid>

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
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        }
      );
    }
    return (
      <Typography gutterBottom>
        No results found.
      </Typography>
    );
  }

  return (
    renderGames(loading)
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
  },
  gameGrid: {
    display: 'inline-block',
    marginRight: theme.spacing(4),
    verticalAlign: 'top',
  },
  gameSelected: {
    backgroundColor: '#CAF0F3',
    '&:hover': {
      backgroundColor: '#CAF0F3',
      cursor: 'default',
    }
  },
  title: {
    fontWeight: 700,
    fontSize: '110%',
    color: '#384466',
  },
  question: {
    fontWeight: 700,
    color: '#159EFA',
    textAlign: 'right',
    paddingRight: '15px',
  },
  image: {
    height: '125px',
    width: '100%',
    borderRadius: '10px',
    // marginRight: theme.spacing(2),
  },
  square: {
    height: '120px',
    width: '120px',
    borderRadius: '10px',
    marginRight: theme.spacing(2),
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
