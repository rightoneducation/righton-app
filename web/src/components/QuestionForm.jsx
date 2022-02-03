import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Divider, List, ListItem, Button, Grid, Card, CardContent, Paper, Collapse, IconButton } from '@material-ui/core';
import { ExpandMore, Add, Place } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import Placeholder from '../images/RightOnPlaceholder.svg';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    maxWidth: '75%',
    marginLeft: 200,
  },

  input: {
    margin: `${theme.spacing(2)}px 0`,
    width: '100%',
  },

  half: {
    width: '50%'
  },

  imagePreview: {
    padding: 0,
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    right: 0,
    boxSizing: 'border-box',
    width: '375px',
    height: '290px',
  },

  image: {
    maxWidth: '375px',
    maxHeight: '285px',
    display: 'block',
    marginLeft: 'auto'
  },

  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },

  number: {
    width: '40px',
  },

  deleteButton: {
    background: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 18,
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    minHeight: 25,
    minWidth: 25,
    display: 'relative',
    top: -40,
    right: 30,
  },

  back: {
    marginLeft: theme.spacing(2),
  },

  instruction: {
    padding: 0,
  },

  addURLButton: {
    background: 'linear-gradient(90deg, #0A4178 0%, #0F56A1 100%)',
    borderRadius: 50,
    color: 'white',
    position: 'absolute',
    top: 370,
    right: 95,
  },

  greenButton: {
    background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
    borderRadius: 50,
    color: 'white',
    fontSize: 17,
  },

  addGameButton: {
    marginRight: 150,
    color: 'white',
    fontSize: 17,
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
    borderRadius: 50,
  },

  card: {
    borderRadius: '10px',
    boxShadow: '1px 4px 10px lightgrey',
    width: '100%',
    marginBottom: '20px',
  },

  correctCard: {
    borderRadius: '10px',
    boxShadow: '1px 4px 10px lightgrey',
    width: '85%',
    border: '5px solid #4DED66',
    marginBottom: '20px',
  },

  answer: {
    fontWeight: 500,
    color: '#384466',
    fontSize: '18px',
  },

  expand: {
    float: 'right',
    color: '#384466',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
  },

  expanded: {
    float: 'right',
    color: '#384466',
    transform: 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
  },

  explanationTitle: {
    fontWeight: 700,
    fontSize: '20px',
    color: '#384466',
  },
}));

export default function QuestionForm({ loading, saveQuestion, deleteQuestion, question: originalQuestion, gameId, gameIndex }) {
  useEffect(() => {
    document.title = 'RightOn! | Edit question';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);

  const [question, setQuestion] = useState( {
    text: '',
    imageUrl: '',
    answer: '',
    instructions: [],
    gameId
  });

  useEffect(() => {
    if (originalQuestion) {
      if (originalQuestion.instructions !== null && originalQuestion.instructions !== [] && typeof originalQuestion.instructions === 'string') {
        originalQuestion.instructions = JSON.parse(originalQuestion.instructions);
        originalQuestion.instructions = JSON.parse(originalQuestion.instructions);
      }
      setQuestion(originalQuestion)
    }
  }, [originalQuestion]);

  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpanded] = useState(false);
  const [imgPreview, setImgPreview] = useState(Placeholder);
  
  const checkURL = () => {
    var image = new Image();
    image.src = question.imageUrl;
    image.onload = function() {
      if (this.width > 0 && this.height > 0) {
        setImgPreview(question.imageUrl);
      }
    }
    image.onerror = function() {
      setImgPreview(Placeholder);
      window.alert('Invalid Image URL. Try Again');
    }
  };
  
  const onChangeMaker = useCallback((field) => ({ currentTarget }) => { setQuestion({ ...question, [field]: currentTarget.value }); }, [question, setQuestion]);

  const onStepChangeMaker = useCallback((index) => ({ currentTarget }) => {
    const newInstructions = [...question.instructions];
    newInstructions[index] = currentTarget.value;
    setQuestion({ ...question, instructions: newInstructions});
  }, [question, setQuestion]);

  const addInstruction = useCallback(() => {
    const instructions = question.instructions == null ? [''] : [...question.instructions, ''];
    setQuestion({ ...question, instructions }); 
  }, [question, setQuestion]);

  const handleSaveQuestion = useCallback(() => {
    if (question.instructions != null && question.instructions !== []) question.instructions = JSON.stringify(question.instructions);
    saveQuestion(question, gameId).then(() => history.push(`/games/${gameIndex}`));
  }, [question, saveQuestion, history, gameId, gameIndex]);

  const handleBack = useCallback(() => {
    history.push(`/games/${gameIndex}`);
  }, [gameIndex, history]);

  const handleRemoveInstruction = useCallback((index) => {
    const newInstructions = [...question.instructions];
    newInstructions.splice(index, 1);
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);

  if (loading) return <Skeleton variant="rect" width={210} height={118} />

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div style={{position: 'relative'}}>
        <Typography gutterBottom variant="h4" component="h1">
          Question

          <Button className={classes.back} onClick={handleBack}>Back</Button>
        </Typography>
        
        {/* Below TextField needs onChange={onChangeMaker(''); find out argument} */}
        <TextField className={classes.input} style={{width: 632}} id="question-topic" value={question.cluster} label="Question Topic - No Functionality" variant="outlined" size="small" />
        <TextField className={classes.input} style={{width: 632}} id="question-text" value={question.text} onChange={onChangeMaker('text')} label="Question Text" variant="outlined" multiline rows={12} required />
        <div className={classes.imagePreview}>
          <img className={classes.image} src={imgPreview} alt="Invalid Image URL" />
        </div>
        <TextField style={{width: 199, position: 'absolute', top: 300, right: 30}} id="image-url" onChange={onChangeMaker('imageUrl')} value={question.imageUrl} label="URL for Photo" variant="outlined" />
        <Button className={classes.addURLButton} variant="contained" onClick={checkURL}>Add</Button>
      </div>

      <Divider className={classes.divider} />

      <div style={{position: 'relative'}}>
        <Grid item xs={12}>
          <Paper className={classes.correctCard}>
            <CardContent style={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography className={classes.answer}>
                  Correct Answer:
              </Typography>
              <TextField size="small" style={{width: 577, margin: 0}} id="answer" value={question.answer} onChange={onChangeMaker('answer')} label="Type Answer Here" variant="outlined" required />
              <IconButton size='small' className={expanded ? classes.expanded : classes.expand} expand={expanded} onClick={() => setExpanded(!expanded)}>
                <ExpandMore fontSize='large'/>
              </IconButton>
            </CardContent>

            <Collapse in={expanded}>
              <CardContent>
                <Typography className={classes.explanationTitle}>
                  Explanation Steps
                </Typography>
                <List>
                  {typeof question.instructions != "string" && question?.instructions?.map((step, index) => (
                    <React.Fragment key={index}>
                      <ListItem className={classes.instruction}>
                        <h1>{index + 1}.</h1>
                        <TextField className={classes.input} id={`step-${index + 1}`} value={step} onChange={onStepChangeMaker(index)} label="Write text here: Remember to be concise!" size="small" multiline rows={5} variant="outlined" required />
                        <Button className={classes.deleteButton} onClick={() => handleRemoveInstruction(index)}>X</Button>
                      </ListItem>
                    </React.Fragment>
                  ))}
                  <ListItem className={classes.instruction}>
                    <Button className={classes.greenButton} startIcon={<Add style={{width: 28, height: 28}} />} variant="contained" onClick={addInstruction}>Add Step</Button>
                  </ListItem>
                </List>
              </CardContent>
            </Collapse>
          </Paper>
        </Grid>
        {/* <List>
          {typeof question.instructions != "string" && question?.instructions?.map((step, index) => (
            <React.Fragment key={index}>
              <ListItem className={classes.instruction}>
                <TextField className={classes.input} id={`step-${index + 1}`} value={step} onChange={onStepChangeMaker(index)} label={`Step ${index + 1}`} variant="filled" required />
                <Button className={classes.deleteButton} onClick={() => handleRemoveInstruction(index)}>X</Button>
              </ListItem>
            </React.Fragment>
          ))}
          <ListItem className={classes.instruction}>
            <Button variant="contained" onClick={addInstruction}>
              Add step
            </Button>
          </ListItem>
        </List> */}
      </div>

      <div style={{textAlign: 'center', marginTop: 50}}>
        <Button className={classes.addGameButton} variant="contained" color="primary" onClick={handleSaveQuestion}>Add to Game</Button>
      </div>
    </form>
  );
}