<<<<<<< HEAD
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import GameLaunch from './GameLaunch';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import GameMaker from './GameMaker';
import { getGameById } from '../lib/games';


export default function Games({ loading, games, saveGame, updateQuestion, deleteQuestion, saveNewGame, deleteGame, cloneGame, sortType, setSortType, cloneQuestion }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };
  const [sortByCheck, setSortByCheck] = React.useState(false);

  return (
    <Grid container className={classes.root} spacing={4}>
      <Route path="/" exact>
        <Grid item xs={12} className={classes.sidebar}>
          <Box className={classes.actions}>
            <SortByDropdown handleSortChange={handleSortChange} sortByCheck={sortByCheck} setSortByCheck={setSortByCheck} />
            <div style={{ width: '100vw', height: 45 }} onClick={() => setSortByCheck(false)}></div>
          </Box>
          <Grid container onClick={() => setSortByCheck(false)}>
            <GameDashboard loading={loading} games={games} saveGame={saveGame} deleteGame={deleteGame} cloneGame={cloneGame} onClickGame={(id) => history.push(`/games/${id}`)}/>
          </Grid>
          
        </Grid>
      </Route>
      {match && getGameById(games, match.params.gameId) && (
        <Grid item xs={12} className={classes.content}>
          <Switch>
            <Route exact path="/games/:gameId/questions/:questionIndex" render={
              ({ match }) => {
                const { questionIndex, gameId } = match.params;
                const game = getGameById(games, gameId);
                return <QuestionDetails backUrl={`/games/${gameId}`} gameTitle={game.title} questionIndex={questionIndex} question={game.questions[questionIndex]} />
              }
            } />
            <Route exact path="/games/:gameId" render={
              ({ match }) => {
                const { gameId } = match.params;
                const game = getGameById(games, gameId)
                return <GameLaunch loading={loading} saveGame={saveGame} deleteQuestion={deleteQuestion} game={game} gameId={gameId} deleteGame={deleteGame} cloneGame={cloneGame} />;
=======
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
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
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

export default function Games({ loading, games, saveGame, saveQuestion, saveNewGame, searchInput, setSearchInput, deleteGame, cloneGame, sortType, setSortType }) {
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
      q1: game.q1,
      q2: game.q2,
      q3: game.q3,
      q4: game.q4,
      q5: game.q5,
      standard: game.standard,
      updated: Date.now(),
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
          const { GameID, title, q1, q2, q3, q4, q5 } = game;
          const questionCount = [q1, q2, q3, q4, q5].filter(q => !!q).length;
          const image = getGameImage(game);
          return (
            <Card className={classnames(classes.game, !match && classes.gameGrid, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={GameID} onClick={() => history.push(`/games/${index + 1}`)}>
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
                      <MenuItem onClick={deleteHandler(GameID)}>Delete</MenuItem>
                    </Menu>
                  </Box>
                </Box>

                <Box className={classes.gameCardBox}>
                  {image && <img className={classes.image} src={image} alt="" />}
                  {!image && (
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
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search games…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={searchInput}
              onChange={({ target }) => setSearchInput(target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Select
            id="sort-select"
            value={sortType}
            onChange={handleSortChange}
          >
            <MenuItem value={SORT_TYPES.UPDATED}>Last Updated</MenuItem>
            <MenuItem value={SORT_TYPES.ALPHABETICAL}>Alphabetical</MenuItem>
          </Select>
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
                return <QuestionForm loading={loading} saveQuestion={saveQuestion} question={games[Number(gameIndex) - 1][`q${Number(questionIndex)}`]} {...match.params} />;
              }
            } />
            <Route path="/games/:gameIndex" render={
              ({ match }) => {
                const { gameIndex } = match.params;
                return <GameForm loading={loading} saveGame={saveGame} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
              }
            } />
          </Switch>
        </Grid>
      )}
<<<<<<< HEAD
      <Route path='/gamemaker/:gameId' render={
        ({ match }) => {
          const { gameId } = match.params;
          const newGame = Number(gameId) === 0;
          return <GameMaker loading={loading} game={newGame ? null : getGameById(games, gameId)} newSave={saveNewGame} editSave={saveGame} gameId={gameId} games={games} cloneQuestion={cloneQuestion} updateQuestion={updateQuestion}/>
        }
      } />;
=======
      <Route path="/games/:gameIndex/edit" render={
        ({ match }) => {
          const { gameIndex } = match.params;
          return <EditGameDialogue open game={games[Number(gameIndex) - 1]} onClose={() => history.push(`/games/${gameIndex}`)} submit={saveGame} />;
        }
      } />
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
  },
<<<<<<< HEAD
  sidebar: {
    padding: `0px 0px ${theme.spacing(4)}px ${theme.spacing(4)}px !important`,
=======
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
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
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
<<<<<<< HEAD
    display: 'inline-flex',
=======
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    display: 'inline-block',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
    },
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
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  },
}));
