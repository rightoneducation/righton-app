import React, {useState} from "react";
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Link, Paper, Button, Box } from '@material-ui/core';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import CCSS from './CCSS';


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
    padding: theme.spacing(1.5),
    display: 'flex',
    marginRight: theme.spacing(2),
    width: '90%',
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      boxShadow: '1px 4px 12px grey',
      cursor: 'pointer',
    },
    height: '152px',
    boxShadow: '1px 4px 8px lightgrey',
    justifyContent: 'space-between'
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
    position: 'sticky',
    alignSelf: "end",
    justifyContent: 'space-evenly'
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

export default function AddQuestion({ game, cloneQuestion, submit, selectedId, gameId }){
  const classes = useStyles();
  const history = useHistory();
  const index = window.location.pathname.split('/')[7];
  const match = useRouteMatch('/gamemaker/:gamemakerIndex/addquestion/gameSelected/:selectedIndex/questionSelected/:questionSelectedIndex');
  
  const handleAddQuestion = async (question) => {
    delete question.id;
    delete question.updatedAt;
    delete question.createdAt;
    const newQuestion = await cloneQuestion(question);
    submit(newQuestion);
    history.push(`/gamemaker/${gameId}`);
  }
  const handleCloneQuestion = async (question) => {
    delete question.id;
    delete question.updatedAt;
    delete question.createdAt;
  }

  // Should be deleted as it is a temporary code for when a game has no questions, which wont exist in MVP
  const addQuestion = () => history.push(`/games/${game.id}/questions/${questions.length + 1}/edit`);

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
            <Paper key={index} className={classes.question} onClick={() => history.push(`/gamemaker/${gameId}/addquestion/gameSelected/${selectedId}/questionSelected/${index+1}`)}>
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

      <Grid container item className={classes.parent}>
        {/* <Grid item xs={4}> */}
          <Button className={classes.greenButton} variant="contained" onClick={() => handleAddQuestion(questions[index-1])}>Add to Game</Button>
        {/* </Grid>
        <Grid item xs={4}> */}
          <Button className={classes.blueButton} variant="contained" onClick={() => handleCloneQuestion(questions[index-1])}>Clone and Edit</Button>
        {/* </Grid>
        <Grid item xs={4}> */}
          <Button className={classes.redButton} variant="contained" onClick={() => history.push(`/games/${game.id}/questions/${match.params.questionSelectedIndex-1}`)}>View Question</Button>
        {/* </Grid>  */}
      </Grid>
    </Grid>
  );
}