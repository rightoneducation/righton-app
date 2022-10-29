import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { Card, Box, Button, Link, Typography, Menu, MenuItem, Grid } from '@material-ui/core';
import { MoreVert, ArrowBack } from '@material-ui/icons';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import MoreCircle from './../images/MoreCircularIcon.png';
import CCSS from './CCSS';


const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    display: 'flex',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  gameImage: {
    width: '60%'
  },
  question: {
    psoition: 'absolute',
    padding: theme.spacing(1.5),
    display: 'flex',
    marginRight: theme.spacing(2),
    width: '90%',
    marginLeft: '3%',
    gridGap: '3%',
    overflow: 'visible',
    borderRadius: '10px',
    marginBottom: theme.spacing(2.5),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      boxShadow: '1px 4px 12px grey',
      cursor: 'pointer',
    },
    height: '152px',
    boxShadow: '1px 4px 8px lightgrey',
  },
  addQuestion: {
    marginBottom: theme.spacing(2),
  },
  hr: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  addLink: {
    padding: 0,
    verticalAlign: 'top',
  },
  noQuestions: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  questionIndex: {
    fontWeight: 'bold',
  },
  textContainer:{
    height: '90%',
    maxWidth: '100%',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 6,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  questionAnswer: {
    display: 'flex',
    width: '148px',
  },
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderWidth:'0',
    borderRadius: '15px'
  },
  square: {
    height: '100px',
    width: '100px',
  },
  moreButton: {
    minWidth: '32px',
    margin: '0 8px',
  },
  back: {
    marginRight: theme.spacing(1),
  },
  leftComponent: {
    textAlign: 'center',
  },
  launchButton: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%);',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
}));

function GameForm({ loading, game, gameId, saveGame, deleteQuestion, deleteGame, cloneGame }) {
  useEffect(() => {
    document.title = 'RightOn! | Game launcher';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);

  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId/question/:questionIndex');
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveIndex(event.currentTarget.dataset.questionIndex);
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveIndex(null);
  };

  const [anchorElGame, setAnchorElGame] = useState(null);
  const [activeGameId, setActiveGameId] = useState(null);
  const handleGameClick = (event) => {
    setAnchorElGame(event.currentTarget);
    setActiveGameId(event.currentTarget.dataset.gameId);
    event.stopPropagation();
  };
  const handleGameClose = () => {
    setAnchorElGame(null);
    setActiveGameId(null);
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
    const gameClone = cloneGame(newGame)
    console.log(gameClone)
    history.push(`/`)
  };
  const deleteHandler = (id) => () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this game?');
    if (confirmDelete) {
      deleteGame(id);
    }
    history.push(`/`)
  };

  //not sure if this should stay
  const changeQuestionIndex = (currentIndex, newIndex) => {
    const newGame = { ...game };
    const copy = { ...newGame[`q${newIndex}`] };
    newGame[`q${newIndex}`] = newGame[`q${currentIndex}`];
    newGame[`q${currentIndex}`] = copy;
    saveGame(newGame).then(() => history.push(`/games/${game.id}`));
    setAnchorEl(null);
    setActiveIndex(null);
  };

  const addQuestion = () => history.push(`/gamemaker/${game.id}/createquestion/${questions.length + 1}`);

  if (loading) return <Skeleton variant="rect" height={500} />;
  const questions = game?.questions || [];
  const questionCount = game?.questions?.length || 0;

  const LAUNCH_GAME_URL = `http://host.rightoneducation.com/new/${game.id}`;

  return (
    <>
      <Box className={classes.actions}>
        <Button type="button" onClick={() => history.push(`/`)}>
          <ArrowBack className={classes.back} />Back to Explore Page
        </Button>

        <Grid>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleGameClick} className={classes.moreButton} data-game-id={gameId}>
            <img src={MoreCircle} alt='More Circular Icon' width={'30px'} />
          </Button>
          <Menu
            id={`game-${gameId}-actions`}
            anchorEl={anchorElGame}
            keepMounted
            open={activeGameId === String(gameId)}
            onClose={handleGameClose}
            onClick={(event) => { if (!match) event.stopPropagation(); }}
          >
            <MenuItem onClick={(event) => { history.push(`/gamemaker/${game.id}`); event.stopPropagation(); handleGameClose(); }}>Edit</MenuItem>
            <MenuItem onClick={cloneHandler(game)}>Clone</MenuItem>
            <MenuItem onClick={deleteHandler(gameId)}>Delete</MenuItem>
          </Menu>
        </Grid>
      </Box>

      <Grid container>
        <Grid item xs={12} sm={4} className={classes.leftComponent}>
          <h3 style={{ color: '#0075FF' }}>{game.title}</h3>

          <p>{game.description}</p>

          {game.imageUrl ? <img className={classes.gameImage} src={game.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" width={'60%'}/>}

          <Button onClick={() => { window.location.href = LAUNCH_GAME_URL }} className={classes.launchButton} >Launch Game {'>'}</Button>
        </Grid>

        <Grid container item xs={12} sm ={8} >
          <Grid item xs={12}>
            <h3 style={{ color: '#0075FF', textAlign: 'center', marginLeft: '3%' }}>Questions ({questionCount}) {questionCount > 1 || questionCount === 0}</h3>
          </Grid>

          {questions.length === 0 && (
            <Typography className={classes.noQuestions} gutterBottom variant="h5" component="div">
              No questions yet. <Link onClick={addQuestion} component="button" variant="h5" className={classes.addLink}>Add a question.</Link>
            </Typography>
          )}
            {questions.map((question, index) => {
              if (question === null) return null;
              const { text, imageUrl } = question;
              return (
                <Grid key={index} item xs={12} sm={6} >
                  <Card className={classes.question} onClick={() => history.push(`/games/${game.id}/questions/${index}`)}>
                    <Grid container item xs={6} sm={8} className={classes.textContainer}>
                        <CCSS grade={question.grade} domain={question.domain} cluster={question.cluster} standard={question.standard} />

                        <Typography className={classes.questionIndex} >
                          Question {index + 1}
                        </Typography>

                        <Typography className={classes.questionText}>
                          {text}
                        </Typography>
                    </Grid>

                    <Grid container item xs={6} sm={4}>
                      <Grid item xs={10} sm={9}>
                        {imageUrl ? <img className={classes.image} src={imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" width={'100%'} />}
                      </Grid>

                      <Grid item xs={2} sm={3}>
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.moreButton} data-question-index={index}>
                          <MoreVert />
                        </Button>

                        <Menu
                          id={`question-${index}-actions`}
                          anchorEl={anchorEl}
                          keepMounted
                          open={activeIndex === String(index)}
                          onClose={handleClose}
                          onClick={(event) => { if (!match) event.stopPropagation(); }}
                        >
                          <MenuItem onClick={(event) => { history.push(`/gamemaker/${gameId}/createquestion/${index + 1}`); event.stopPropagation(); handleClose(); }}>Edit</MenuItem>

                          {index > 1 && <MenuItem onClick={() => changeQuestionIndex(index, index - 1)}>Move Up</MenuItem>}

                          {index < questions.length && <MenuItem onClick={() => changeQuestionIndex(index, index + 1)}>Move Down</MenuItem>}

                          <MenuItem onClick={() => { deleteQuestion(question.id).then(() => history.push(`/games/${game.id}`)); setAnchorEl(null); setActiveIndex(null); }}>Delete</MenuItem>
                        </Menu>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </>
  );
}

export default GameForm;
