import React, { useState } from 'react';
import classnames from 'classnames';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { SORT_TYPES } from '../lib/sorting';
import { fade, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import { getGameImage } from '../lib/games';
import QuestionForm from './QuestionForm';
import GameForm from './GameForm';
import NewGameDialogue from './NewGameDialogue';
import EditGameDialogue from './EditGameDialogue';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Select from '@material-ui/core/Select';
import CCSS from './CCSS';

export default function Games({ loading, games, saveGame, saveQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');
  const [newGameOpen, setNewGameOpen] = useState(false);
  const handleNewGame = async (game) => {
    setNewGameOpen(false);
    await saveNewGame(game);
    history.push('/games/1');
  };
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
  const handleSortChange = (event) => {
    setSortType(event.target.value);
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
            <Card className={classnames(classes.game, !match && classes.gameGrid, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={id} onClick={() => history.push(`/games/${index + 1}`)}>
              <CardContent>
                <Box className={classes.titleRow}>
                  <Typography className={classes.title} gutterBottom>
                    {title}
                  </Typography>
                  <Box className={classes.more}>
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
                      <MenuItem onClick={(event) => { history.push(`/games/${index + 1}/edit`); event.stopPropagation(); handleClose(); }}>Edit</MenuItem>
                      <MenuItem onClick={cloneHandler(game)}>Clone</MenuItem>
                      <MenuItem onClick={deleteHandler(id)}>Delete</MenuItem>
                    </Menu>
                  </Box>
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
      <Typography gutterBottom>
        No results found.
      </Typography>
    );
  }

  return (
    <Grid container className={classes.root} spacing={4}>
      <Grid item xs={match ? 3 : 12} className={classes.sidebar}>
        <Box className={classes.actions}>
          <Button variant="contained" color="primary" onClick={() => setNewGameOpen(true)}>
            New game
          </Button>
          {/* Search filtering dropdown */}
          {/* <Select
            id="sort-select"
            value={sortType}
            onChange={handleSortChange}
          >
            <MenuItem value={SORT_TYPES.UPDATED}>Last Updated</MenuItem>
            <MenuItem value={SORT_TYPES.ALPHABETICAL}>Alphabetical</MenuItem>
          </Select> */}
          <NewGameDialogue open={newGameOpen} onClose={() => setNewGameOpen(false)} submit={handleNewGame} />
        </Box>
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
      <Route path="/games/:gameIndex/edit" render={
        ({ match }) => {
          const { gameIndex } = match.params;
          return <EditGameDialogue open game={games[Number(gameIndex) - 1]} onClose={() => history.push(`/games/${gameIndex}`)} submit={saveGame} />;
        }
      } />
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
  },
  game: {
    width: '350px',
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
    },
    height: '152px',
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
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  content: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#F2F2F2',
  },
  actions: {
    marginBottom: '16px',
  },
  image: {
    width: '80px',
    maxHeight: '80px',
    marginRight: theme.spacing(2),
  },
  square: {
    height: '80px',
    width: '80px',
    marginRight: theme.spacing(2),
  },
  gameCardBox: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  title: {
    fontWeight: 500,
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  more: {
    display: 'inline-block',
  },
  moreButton: {
    minWidth: '28px',
    margin: '0',
  },
}));
