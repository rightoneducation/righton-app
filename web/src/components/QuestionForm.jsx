import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Divider, Button, Select, MenuItem, Grid } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Placeholder from '../images/RightOnPlaceholder.svg';
import QuestionFormAnswerDropdown from './QuestionFormAnswerDropdown';
import QuestionIcon from './QuestionIcon';
// import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '1%',
    paddingBottom: '10px',
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
    maxHeight: '320px',
  },
  divider: {
    height: '1px',
    width: '100%',
    marginBottom: '20px',
    marginTop: '20px',
    backgroundColor: '#A7A7A7',
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
    position: 'absolute',
    top: 100,
    left: 0,
  },
  instruction: {
    padding: 0,
  },
  addURLButton: {
    background: 'linear-gradient(90deg, #0A4178 0%, #0F56A1 100%)',
    borderRadius: 50,
    color: 'white',
  },
  greenButton: {
    background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
    borderRadius: 50,
    color: 'white',
    fontSize: 17,
  },
  addGameButton: {
    color: 'white',
    fontSize: 16,
    background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
    borderRadius: 60,
    width: 170,
    height: 58
  },
  dropdown: {
    width: 120,
    height: 44,
    background: '#FFFFFF',
    border: '1px solid #BDBDBD',
    boxSizing: 'border-box',
    borderRadius: '8px',
    padding: 20,
    fontSize: 20,
  },
  dropdownWrapper: {
    textAlign: 'left',
    '& p': {
      fontSize: '14px', 
      fontWeight: 700,
    }
  },
  MenuProps: {
    '& .MuiMenuItem-root.Mui-selected': {
      color: 'white',
      background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
    },
  },
}));

export default function QuestionForm({ saveQuestion, question: originalQuestion, gamemakerIndex }) {
  useEffect(() => {
    document.title = 'RightOn! | Question editor';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);

  const classes = useStyles();
  const history = useHistory();
  const [question, setQuestion] = useState( {
    text: '',
    imageUrl: '',
    answer: '',
    wrongAnswers: [{choice: "", explanation: ""}, {choice: "", explanation: ""}, {choice: "", explanation: ""}],
    instructions: [],
  });

  // Parses through JSON string of instructions and wrong answer objects (wrong answers and reasons) twice because of how it is saved on backend (turns data into a string twice so needs to be parsed twice)
  useEffect(() => {
    if (originalQuestion) {
      if (originalQuestion.instructions !== null && originalQuestion.instructions !== [] && typeof originalQuestion.instructions === 'string') {
        originalQuestion.instructions = JSON.parse(originalQuestion.instructions);
        originalQuestion.instructions = JSON.parse(originalQuestion.instructions);
      }
      if (originalQuestion.wrongAnswers !== null && originalQuestion.wrongAnswers !== [] && typeof originalQuestion.wrongAnswers === 'string') {
        originalQuestion.wrongAnswers = JSON.parse(originalQuestion.wrongAnswers);
        originalQuestion.wrongAnswers = JSON.parse(originalQuestion.wrongAnswers);
      }
      setQuestion(originalQuestion);
    }
  }, [originalQuestion]);
  
  // Handles which Url to redirect to when clicking the Back to Game Maker button
  const handleBack = useCallback(() => {
    if(gamemakerIndex != null) {
      history.push(`/gamemaker/${gamemakerIndex}`);
    }
    else {
      history.push(`/gamemaker/0`);
    }
  }, [gamemakerIndex, history]);

  // When the correct answer is changed/update this function handles that change
  const onChangeMaker = useCallback((field) => ({ currentTarget }) => { setQuestion({ ...question, [field]: currentTarget.value }); }, [question, setQuestion]);

  // Handles addition of new step in the correct answer instructions set
  const addInstruction = useCallback(() => {
    const instructions = question.instructions == null ? [''] : [...question.instructions, ''];
    setQuestion({ ...question, instructions }); 
  }, [question, setQuestion]);

  // Handles the edit/updating of a step in correct answers instructions set
  const onStepChangeMaker = useCallback((index) => ({ currentTarget }) => {
    const newInstructions = [...question.instructions];
    newInstructions[index] = currentTarget.value;
    setQuestion({ ...question, instructions: newInstructions});
  }, [question, setQuestion]);

  // Handles removal of a step in the correct answer instructionsset
  const handleRemoveInstruction = useCallback((index) => {
    const newInstructions = [...question.instructions];
    newInstructions.splice(index, 1);
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);

  // When a wrong answer is changed/update this function handles that change
  const onWrongChoiceChangeMaker = useCallback((wrongAnswersIndex) => ({ currentTarget }) => {
    const newWrongAnswers = [...question.wrongAnswers];
    newWrongAnswers[wrongAnswersIndex].choice = currentTarget.value;
    setQuestion({ ...question, wrongAnswers: newWrongAnswers});
  }, [question, setQuestion]);

  // When the wrong answer reasoning is changed/update this function handles that change
  const onWrongExplanationChangeMaker = useCallback((wrongAnswersIndex) => ({ currentTarget }) => {
    const newWrongAnswers = [...question.wrongAnswers];
    newWrongAnswers[wrongAnswersIndex].explanation = currentTarget.value;
    setQuestion({ ...question, wrongAnswers: newWrongAnswers});
  }, [question, setQuestion]);

  // Handles grade, domain, cluster, or standard change/update
  const onSelectMaker = useCallback((field) => ({target}) => { setQuestion({ ...question, [field]: target.value }); }, [question, setQuestion]);


  // Handles saving a new or updated question. If certain required fields are not met it throws an error popup
  const handleSaveQuestion = useCallback(() => {
    if(question.text == null || question.text === "") {
      window.alert("Please enter a question");
      return;
    }
    if(question.answer == null || question.answer === "") {
      window.alert("Please enter an answer");
      return;
    }
    if(question.grade == null || question.grade === "") {
      window.alert("Please enter a grade level");
      return;
    }
    if(question.domain == null || question.domain === "") {
      window.alert("Please enter a domain/subject");
      return;
    }
    if (question.instructions != null && question.instructions !== []) question.instructions = JSON.stringify(question.instructions);
    if (question.wrongAnswers != null && question.wrongAnswers !== []) question.wrongAnswers = JSON.stringify(question.wrongAnswers);
    // saveQuestion(question, gameId).then(() => history.push(`/games/${gameIndex}`));
    saveQuestion(question).then(() => history.push(`/gamemaker/:gamemakerIndex`));
  }, [question, saveQuestion, history, gamemakerIndex]);

  // if (loading) return <Skeleton variant="rect" width={210} height={118} />


  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Button type="button" className={classes.back} onClick={handleBack}>
        <ArrowBack style={{marginRight: 8}} />Back to Game Maker
      </Button>

      <Grid container>
        <Grid container item xs={2}></Grid>
            
        <Grid item container xs={8}>
          <Grid item container xs={12}>
            <Typography gutterBottom variant="h4" component="h1">Question</Typography>
          </Grid>

          <Grid item container xs={8}>
            <TextField className={classes.input} id="question-text" value={question.text} onChange={onChangeMaker('text')} label="Question Text" variant="outlined" fullWidth multiline rows={10} required />

            <TextField id="image-url" onChange={onChangeMaker('imageUrl')} fullWidth value={question.imageUrl} label="URL for Photo" variant="outlined" />
          </Grid>

          <Grid item container justifyContent='center' xs={4}>
              {question.imageUrl ? <img src={question.imageUrl} alt="" width={'60%'} /> : <img className={classes.image} src={Placeholder} alt="Invalid URL" />}
          </Grid>

          <Divider className={classes.divider} />

          <Grid item container xs={12}>
            <QuestionFormAnswerDropdown question={question} correct={true} onChangeMaker={onChangeMaker} onStepChangeMaker={onStepChangeMaker} handleRemoveInstruction={handleRemoveInstruction} addInstruction={addInstruction} />

            <QuestionFormAnswerDropdown question={question} correct={false} onChangeMaker={onChangeMaker} onStepChangeMaker={onStepChangeMaker} handleRemoveInstruction={handleRemoveInstruction} addInstruction={addInstruction} wrongAnswersIndex={0} onWrongChoiceChangeMaker={onWrongChoiceChangeMaker} onWrongExplanationChangeMaker={onWrongExplanationChangeMaker} />

            <QuestionFormAnswerDropdown question={question} correct={false} onChangeMaker={onChangeMaker} onStepChangeMaker={onStepChangeMaker} handleRemoveInstruction={handleRemoveInstruction} addInstruction={addInstruction} wrongAnswersIndex={1} onWrongChoiceChangeMaker={onWrongChoiceChangeMaker} onWrongExplanationChangeMaker={onWrongExplanationChangeMaker} />

            <QuestionFormAnswerDropdown question={question} correct={false} onChangeMaker={onChangeMaker} onStepChangeMaker={onStepChangeMaker} handleRemoveInstruction={handleRemoveInstruction} addInstruction={addInstruction} wrongAnswersIndex={2} onWrongChoiceChangeMaker={onWrongChoiceChangeMaker} onWrongExplanationChangeMaker={onWrongExplanationChangeMaker} />
          </Grid>
        
          <Grid item container xs={12}>
            <Typography gutterBottom variant="h4" component="h1" style={{marginRight: 30, display: 'inline'}}>Enter CCSS</Typography>

            <QuestionIcon />
          </Grid>

          <Grid item container xs={12} justifyContent='space-between'>
            <div className={classes.dropdownWrapper}>
              <p>Grade Level*</p>
              <Select 
                className={classes.dropdown} 
                label="Grade Level" 
                onChange={onSelectMaker('grade')}
                disableUnderline
                defaultValue=""
                required
                MenuProps={{classes: {paper: classes.MenuProps}}}
              >
                <MenuItem value={"6"}>6</MenuItem>
                <MenuItem value={"7"}>7</MenuItem>
                <MenuItem value={"8"}>8</MenuItem>
                <MenuItem value={"9"}>9</MenuItem>
                <MenuItem value={"10"}>10</MenuItem>
                <MenuItem value={"11"}>11</MenuItem>
                <MenuItem value={"12"}>12</MenuItem>
              </Select>
            </div>

            <div className={classes.dropdownWrapper}>
              <p>Domain/Subject*</p>
              <Select 
                className={classes.dropdown} 
                label="Domain/Subject" 
                onChange={onSelectMaker('domain')}
                disableUnderline
                defaultValue=""
                required
                MenuProps={{classes: {paper: classes.MenuProps}}}
              >
                <MenuItem value={"RP"}>RP: Ratios & Proportional Relationships</MenuItem>
                <MenuItem value={"NS"}>NS: Number System</MenuItem>
                <MenuItem value={"EE"}>EE: Expressions & Equations</MenuItem>
                <MenuItem value={"G"}>G: Geometry</MenuItem>
                <MenuItem value={"SP"}>SP: Statistics & Probability</MenuItem>
                <MenuItem value={"F"}>F: Functions</MenuItem>
              </Select>
            </div>

            <div className={classes.dropdownWrapper}>
              <p>Cluster</p>
              <Select 
                className={classes.dropdown} 
                label="Cluster" 
                onChange={onSelectMaker('cluster')}
                defaultValue=""
                disableUnderline
                MenuProps={{classes: {paper: classes.MenuProps}}}
              >
                <MenuItem value={"A"}>A</MenuItem>
                <MenuItem value={"B"}>B</MenuItem>
                <MenuItem value={"C"}>C</MenuItem>
              </Select>
            </div>

            <div className={classes.dropdownWrapper}>
              <p>Standard</p>
              <Select 
                className={classes.dropdown} 
                label="Standard" 
                onChange={onSelectMaker('standard')}
                defaultValue=""
                disableUnderline
                MenuProps={{classes: {paper: classes.MenuProps}}}
              >
                <MenuItem value={"1"}>1</MenuItem>
                <MenuItem value={"2"}>2</MenuItem>
                <MenuItem value={"3"}>3</MenuItem>
                <MenuItem value={"4"}>4</MenuItem>
                <MenuItem value={"5"}>5</MenuItem>
                <MenuItem value={"6"}>6</MenuItem>
                <MenuItem value={"7"}>7</MenuItem>
                <MenuItem value={"8"}>8</MenuItem>
                <MenuItem value={"9"}>9</MenuItem>
              </Select>
            </div>
          </Grid>

          <Grid style={{marginTop: 50}} item container xs={12} justifyContent='center'>
            <Button className={classes.addGameButton} variant="contained" color="primary" onClick={handleSaveQuestion}>Add to Game</Button>
          </Grid>

        </Grid>

        <Grid container item xs={2}></Grid>
      </Grid>
    </form>
  );
}