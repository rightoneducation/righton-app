import React from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import CCSS from './CCSS';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({}));

function AddQuestion(gameIndex, game, saveGame){
    const classes = useStyles();
    const questionCount = game?.questions?.length || 0;
    const questions = game?.questions || [];
    console.log(game);
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
    const history = useHistory();
    const changeQuestionIndex = (currentIndex, newIndex) => {
        const newGame = { ...game };
        const copy = { ...newGame[`q${newIndex}`] };
        newGame[`q${newIndex}`] = newGame[`q${currentIndex}`];
        newGame[`q${currentIndex}`] = copy;
        saveGame(newGame).then(() => history.push('/games/1'));
        setAnchorEl(null);
        setActiveIndex(null);
    };

    return (
        <Grid container item xs={8} className={classes.rightComponent} >
          <Grid item xs={12}>
            <h3 style={{color:'#0075FF', textAlign:'center'}}>Questions ({questionCount}) {questionCount > 1 || questionCount === 0}</h3>
          </Grid>
          {questions.map((question, index) => {
            if (question === null) return null;
            const { text, answer, imageUrl } = question;
            return (
              <Grid item xs={6}>
              <Paper key={index} className={classes.question} onClick={() => history.push(`/games/${gameIndex}/questions/${index}`)}>
                <Box>
                  <CCSS grade={game.grade} domain={game.domain} cluster={game.cluster} standard={game.standard} />
                  <Box className={classes.questionIndex}>
                    <Typography variant="h9">
                      Question {index+1}
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
                    {imageUrl ? <img className={classes.image} src={imageUrl} alt="" /> : <img src={RightOnPlaceHolder} width={'100%'}/>}
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
                      <MenuItem onClick={() => history.push(`/games/${gameIndex}/questions/${index}/edit`)}>Edit</MenuItem>
                      {index > 1 && <MenuItem onClick={() => changeQuestionIndex(index, index - 1)}>Move Up</MenuItem>}
                      {index < questions.length && <MenuItem onClick={() => changeQuestionIndex(index, index + 1)}>Move Down</MenuItem>}
                    </Menu>
                  </Box>
                </Box>
              </Paper>
            </Grid> 
            );
          })}
        </Grid>
    );
}

export default AddQuestion;