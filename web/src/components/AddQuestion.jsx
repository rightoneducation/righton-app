import React, {useState} from "react";
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

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    display: 'flex',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  question: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
    },
    height: '152px',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: '18px',
    marginRight: theme.spacing(2),
  },
  addQuestion: {
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
    minWidth: '32px',
    fontWeight: 'bold',
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
  moreButton: {
    minWidth: '32px',
    margin: '0 8px',
  },
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  rightComponent:{
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  parent: {
    position: "fixed",
    alignSelf: "end",
  },
  blueButton: {
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%);',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
  greenButton: {
      background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
      borderRadius: '50px',
      textTransform: 'none',
      fontSize: '17px',
      fontWeight: 500,
      color: 'white',
  },
  redButton: {
    background: 'linear-gradient(90deg, #E2215D 0%, #FC2164 100%)',
      borderRadius: '50px',
      textTransform: 'none',
      fontSize: '17px',
      fontWeight: 500,
      color: 'white',
  }
}));

function AddQuestion({ loading, gameIndex, game, saveGame, deleteQuestion, selectedIndex, questionIndex, cloneQuestion, submit, gamemakerIndex }){
  const classes = useStyles();
  const history = useHistory();
  const [setAnchorEl] = React.useState(null);
  const [setActiveIndex] = React.useState(null);
  const index = window.location.pathname.split('/')[7];
  
  const handleCloneQuestion = async (question) => {
    delete question.id;
    delete question.updatedAt;
    delete question.createdAt;
    const newQuestion = await cloneQuestion(question);
    submit(newQuestion);
    history.push('/gamemaker');
  }

  const addQuestion = () => history.push(`/games/${selectedIndex}/questions/${questions.length + 1}/edit`);

  const questions = game?.questions || [];

  const questionCount = game?.questions?.length || 0;

    return (
      <Grid container item xs={12} className={classes.rightComponent} >
      <Grid item xs={12}>
        <h3 style={{color:'#0075FF', textAlign:'center'}}>Questions ({questionCount}) {questionCount > 1 || questionCount === 0}</h3>
      </Grid>
      {questions.length === 0 && (
        <Typography className={classes.noQuestions} gutterBottom variant="h5" component="div">
          No questions yet. <Link onClick={addQuestion} component="button" variant="h5" className={classes.addLink}>Add a question.</Link>
        </Typography>
      )}
      {questions.map((question, index) => {
        if (question === null) return null;
        const { text, answer, imageUrl } = question;
        return (
        <Grid item xs={12} >
          <Paper key={index} className={classes.question} onClick={() => history.push(`/gamemaker/${gamemakerIndex}/addquestion/gameSelected/${selectedIndex}/questionSelected/${index+1}`)}>
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

            </Box>
          </Paper>
        </Grid> 
        );
      })}
      <Grid container className={classes.parent}>
        <Grid item xs={2}>
          <Button className={classes.greenButton} color="primary" type="button" variant="contained" onClick={() => handleCloneQuestion(questions[index-1])}>Add to Game</Button>
        </Grid>
        <Grid item xs={2}>
          <Button className={classes.blueButton} color="primary" type="button" variant="contained">Clone and Edit</Button>
        </Grid>
        <Grid item xs={2}>
          <Button className={classes.redButton} color="primary" type="button" variant="contained">View Question</Button>
        </Grid> 
      </Grid>
    </Grid>
    );
}

export default AddQuestion;