import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    maxWidth: '75%',
  },

  input: {
    margin: `${theme.spacing(2)}px 0`,
    width: '100%'
  },

  half: {
    width: '50%'
  },

  imagePreview: {
    padding: theme.spacing(2),
    display: 'inline-block',
    boxSizing: 'border-box',
  },

  image: {
    maxWidth: '100%',
    maxHeight: '250px',
  },

  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },

  number: {
    width: '40px',
  },

  deleteButton: {
    marginLeft: theme.spacing(1),
    height: '56px',
  },

  back: {
    marginLeft: theme.spacing(2),
  },

  instruction: {
    padding: 0,
  }
}));

function QuestionForm({ loading, saveQuestion, deleteQuestion, question: originalQuestion, gameId, gameIndex }) {
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
  }, [question, saveQuestion, history, gameId, gameIndex])
  const handleBack = useCallback(() => {
    history.push(`/games/${gameIndex}`);
  }, [gameIndex, history])
  const handleRemoveInstruction = useCallback((index) => {
    const newInstructions = [...question.instructions];
    newInstructions.splice(index, 1);
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);
  if (loading) return <Skeleton variant="rect" width={210} height={118} />
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Typography gutterBottom variant="h4" component="h1">
        {originalQuestion ? 'Edit' : 'New'} question

        <Button className={classes.back} onClick={handleBack}>
          Back
        </Button>
      </Typography>

      <TextField className={classes.input} id="question-text" value={question.text} onChange={onChangeMaker('text')} label="Question Text" variant="filled" multiline rows={4} required />
      <TextField className={classnames(classes.input, classes.half)} id="image-url" value={question.imageUrl} onChange={onChangeMaker('imageUrl')} label="URL for Photo" variant="filled" />
      <div className={classnames(classes.half, classes.imagePreview)}>
        {question.imageUrl && <img className={classes.image} src={question.imageUrl} alt="Preview" />}
      </div>

      <Divider className={classes.divider} />

      <TextField className={classes.input} id="answer" value={question.answer} onChange={onChangeMaker('answer')} label="Answer" variant="filled" required />
      <h3>Solution Steps</h3>
      <List>
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
      </List>

      <Divider className={classes.divider} />

      <Button variant="contained" color="primary" onClick={handleSaveQuestion}>
        Save
      </Button>
    </form>
  );
}

export default QuestionForm;
