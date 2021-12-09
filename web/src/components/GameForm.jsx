import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CCSS from './CCSS';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  ccss: {
    display: 'inline-block',
    lineHeight: '52px',
  },
  input: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  question: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
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
  questionLeftContainer: {
    display: 'flex',
  },
  questionIndex: {
    minWidth: '32px',
  },
  questionText: {
    paddingRight: theme.spacing(2),
    maxWidth: '500px',
    whiteSpace: 'pre-wrap',
  },
  questionAnswer: {
    display: 'flex',
    width: '148px',
  },
  image: {
    width: '100px',
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
  }
}));

function GameForm({ loading, game, gameIndex, saveGame }) {
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    document.title = 'RightOn! | Edit game';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setActiveIndex(event.currentTarget.dataset.questionIndex);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveIndex(null);
  };
  //not sure if this should stay
  const changeQuestionIndex = (currentIndex, newIndex) => {
    const newGame = { ...game };
    const copy = { ...newGame[`q${newIndex}`] };
    newGame[`q${newIndex}`] = newGame[`q${currentIndex}`];
    newGame[`q${currentIndex}`] = copy;
    saveGame(newGame).then(() => history.push('/games/1'));
    setAnchorEl(null);
    setActiveIndex(null);
  };
  const addQuestion = () => history.push(`/games/${gameIndex}/questions/${questions.length + 1}`);

  if (loading) return <Skeleton variant="rect" height={500} />;

  const questions = game?.questions || [];

  return (
    <>
      <Box className={classes.actions}>
        <Button type="button" onClick={() => history.push(`/`)}>
          <ArrowBackIcon className={classes.back} />Exit Game
        </Button>
        {game.grade !== 'General' && (
          <>
          <strong>CCSS: </strong>
          <CCSS game={game} />
          </>
        )}
        <Button className={classes.addQuestion} color="primary" type="button" variant="contained" onClick={addQuestion}>
          Add question
        </Button>
      </Box>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={(event) => event.preventDefault()}>
        {questions.length === 0 && (
          <Typography className={classes.noQuestions} gutterBottom variant="h5" component="div">
            No questions yet. <Link onClick={addQuestion} component="button" variant="h5" className={classes.addLink}>Add a question.</Link>
          </Typography>
        )}
        {questions.map((question, index) => {
          if (question === null) return null;
          const { text, answer, imageUrl } = question;
          return (
            <Paper key={index} className={classes.question}>
              <Box className={classes.questionLeftContainer}>
                <Box className={classes.questionIndex}>
                  <Typography variant="h5">
                    {index+1}.
                  </Typography>
                </Box>
                <Box className={classes.questionText}>
                  <Typography>
                    {text}
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.questionAnswer}>
                <Box>
                  {imageUrl && <img className={classes.image} src={imageUrl} alt="" />}
                  {!imageUrl && <Avatar variant="square" className={classes.square}>
                    <ImageIcon fontSize="large" />
                  </Avatar>}
                  <Typography align="center">
                    {answer}
                  </Typography>
                </Box>
                <Box>
                  <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.moreButton} data-question-index={index}>
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    id={`question-${index}-actions`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={activeIndex === String(index)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => history.push(`/games/${gameIndex}/questions/${index}`)}>Edit</MenuItem>
                    {index > 1 && <MenuItem onClick={() => changeQuestionIndex(index, index - 1)}>Move Up</MenuItem>}
                    {index < questions.length && <MenuItem onClick={() => changeQuestionIndex(index, index + 1)}>Move Down</MenuItem>}
                    <MenuItem onClick={() => { saveGame({ ...game, [`q${index}`]: null }).then(() => history.push('/games/1')); setAnchorEl(null); setActiveIndex(null); }}>Delete</MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </form>
    </>
  );
}

export default GameForm;
