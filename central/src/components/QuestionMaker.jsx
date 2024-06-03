import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, Divider, Button, Select, MenuItem, Grid, Box, Radio } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Placeholder from '../images/RightOnPlaceholder.svg';
import QuestionMakerAnswerDropdown from './QuestionMakerAnswerDropdown';
import QuestionHelper from './QuestionHelper';
import { NumericAnswer, StringAnswer, ExpressionAnswer, AnswerType, AnswerPrecision, PublicPrivateType } from '@righton/networking';

export default function QuestionMaker({ 
  gameId, 
  originalQuestion, 
  localQuestionTemplates,
  setLocalQuestionTemplates,
  handleCreateQuestionTemplate, 
  handleUpdateQuestionTemplate,
  listQuerySettings,
  publicPrivateQueryType,
  handlePublicPrivateChange,
}) {
  useEffect(() => {
    document.title = 'RightOn! | Question editor';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch('/gamemaker/');
  const [isAnswerTypeValid, setIsAnswerTypeValid] = useState(false);
  const [isAnswerPrecisionValid, setIsAnswerPrecisionValid] = useState(false);
  const initialState = useMemo(() => originalQuestion != null, [originalQuestion]);
  const [question, setQuestion] = useState(() => {
    if (originalQuestion) {
      const copyOfOriginal = { ...originalQuestion }
      copyOfOriginal.choices = JSON.parse(copyOfOriginal.choices)
      copyOfOriginal.instructions = JSON.parse(copyOfOriginal.instructions);
      copyOfOriginal.answerSettings = JSON.parse(copyOfOriginal.answerSettings);
      return copyOfOriginal
    }
    return {
      title: '',
      imageUrl: '',
      choices: [{ text: '', reason: '', isAnswer: true }, { text: '', reason: '', isAnswer: false }, { text: '', reason: '', isAnswer: false }, { text: '', reason: '', isAnswer: false }],
      grade: null,
      domain: null,
      cluster: null,
      standard: null,
    }
  });
  const [answerType, setAnswerType] = useState(question.answerSettings?.answerType ?? AnswerType.NUMBER);
  const [answerPrecision, setAnswerPrecision] = useState(question.answerSettings?.answerPrecision ?? AnswerPrecision.WHOLE);
  // Handles which Url to redirect to when clicking the Back to Game Maker button
  const handleBack = useCallback(() => {
    if (match) {
      history.push(`/gamemaker/${gameId}`);
    }
    else {
      history.push(`/questions`);
    }
  }, [gameId, history]);

  const handleStringInput = (value) => {
    let newString = value.replace(/\'/g, '\u2019');
    return newString;
  }

  const isNullOrEmpty = (str) => {
    return !str || str.length < 1;
  }

  // When the correct answer is changed/update this function handles that change
  const onChangeMaker = useCallback((field) => ({ currentTarget }) => { setQuestion({ ...question, [field]: handleStringInput(currentTarget.value) }); }, [question, setQuestion]);

  // When a wrong answer is changed/update this function handles that change
  const onChoiceTextChangeMaker = ( choiceIndex, choice, answerType) => ({ currentTarget }) => {
    if (choice.isAnswer === true){
      switch(answerType){
        case AnswerType.STRING:
        default:
          setIsAnswerTypeValid(StringAnswer.isAnswerTypeValid(currentTarget.value));
          setIsAnswerPrecisionValid(true);
          break;
        case AnswerType.NUMBER:
          setIsAnswerTypeValid(NumericAnswer.isAnswerTypeValid(currentTarget.value));
          currentTarget.value = currentTarget.value.replace(/[^0-9.%-]/g, '');
          setIsAnswerPrecisionValid((prev) => NumericAnswer.isAnswerPrecisionValid(currentTarget.value, answerPrecision));
          break;
        case AnswerType.EXPRESSION:
          setIsAnswerTypeValid(ExpressionAnswer.isAnswerTypeValid(currentTarget.value));
          setIsAnswerPrecisionValid(true);
          break;
      }
    }
    const newChoices = [...question.choices];
    newChoices[choiceIndex].text = handleStringInput(currentTarget.value);
    setQuestion({ ...question, choices: newChoices });
  };

  // When the wrong answer reasoning is changed/update this function handles that change
  const onChoiceReasonChangeMaker = useCallback((choiceIndex) => ({ currentTarget }) => {
    const newChoices = [...question.choices];
    newChoices[choiceIndex].reason = handleStringInput(currentTarget.value);
    setQuestion({ ...question, choices: newChoices });
  }, [question, setQuestion]);

  // Handles addition of new step in the correct answer instructions set
  const addInstruction = useCallback(() => {
    const instructions = question.instructions == null ? [''] : [...question.instructions, ''];
    setQuestion({ ...question, instructions });
  }, [question, setQuestion]);

  // Handles the edit/updating of a step in correct answers instructions set
  const onStepChangeMaker = useCallback((index) => ({ currentTarget }) => {
    const newInstructions = [...question.instructions];
    newInstructions[index] = handleStringInput(currentTarget.value);
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);

  // Handles removal of a step in the correct answer instructionsset
  const handleRemoveInstruction = useCallback((index) => {
    const newInstructions = [...question.instructions];
    newInstructions.splice(index, 1);
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);

  // Handles grade, domain, cluster, or standard change/update
  const onSelectMaker = useCallback((field) => ({ target }) => { setQuestion({ ...question, [field]: target.value }); }, [question, setQuestion]);

  // Handles saving a new or updated question. If certain required fields are not met it throws an error popup
  const handleSaveQuestionTemplate = async (question) => {
    if (isNullOrEmpty(question.title)) {
      window.alert("Please enter a question");
      return;
    }
    if (isNullOrEmpty(question.choices[0].text)) {
      window.alert("Please enter a correct answer")
      return;
    }
    if (question.instructions == null || question.instructions.filter(step => !isNullOrEmpty(step)).length < 1) {
      window.alert("Please provide at least one step for the correct answer explanation");
      return;
    }
    for (let idx = 1; idx < (question.choices).length; idx++) {
      if (isNullOrEmpty(question.choices[idx].text)) {
        window.alert(`Please enter an answer for wrong answer  ${idx}`);
        return;
      }
    }
    if (isNullOrEmpty(question.grade)) {
      window.alert("Please enter a grade level");
      return;
    }
    if (isNullOrEmpty(question.domain)) {
      window.alert("Please enter a domain/subject");
      return;
    }
    if (question.cluster == null && question.standard != null) {
      window.alert("Please enter a cluster to save the game");
      return;
    }
    try{
      const questionToSend = { ...question };
      questionToSend.choices = JSON.stringify(questionToSend.choices)
      questionToSend.instructions = JSON.stringify(questionToSend.instructions.filter(step => step !== ""));
      questionToSend.answerSettings = JSON.stringify({ answerType, answerPrecision });
      questionToSend.version = 0;
      questionToSend.gameTemplatesCount = 0;
      let newQuestion;
      if (gameId){
        questionToSend.id = uuidv4();
        setLocalQuestionTemplates([...localQuestionTemplates, {questionTemplate: questionToSend, gameQuestionId: null}]);
        history.push(`/gamemaker/${gameId}`);
        return;
      }
      if (questionToSend.id) {
        newQuestion = await handleUpdateQuestionTemplate(questionToSend);
      } else {
        questionToSend.id = uuidv4();
        newQuestion = await handleCreateQuestionTemplate(questionToSend);
        delete newQuestion.updatedAt;
        delete newQuestion.createdAt;
      }
      history.push(`/questions/${newQuestion.id}`);
    } catch (e) {
      console.log(e);
    }
    history.push('/questions');
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container className={classes.root}>
        <Grid container item xs={1} sm={2}>
          <Button type="button" className={classes.back} onClick={handleBack}>
            <ArrowBack style={{ marginRight: 8 }} />
              {match ? `Back to Game Maker` : `Back to Questions`}
          </Button>
        </Grid>

        <Grid item container xs={7} sm={8}>
          <Grid item container xs={12}>
            <Typography gutterBottom variant="h4" component="h1">
              {initialState ? 'Edit' : 'Create'}{' '}Question
            </Typography>
          </Grid>

          <Grid item container xs={8}>
            <TextField className={classes.input} id="question-text" value={question.title} onChange={onChangeMaker('title')} label="Question Text" variant="outlined" fullWidth multiline rows={10} required />

            <TextField id="image-url" onChange={onChangeMaker('imageUrl')} fullWidth value={question.imageUrl} label="URL for Photo" variant="outlined" />
          </Grid>

          <Grid item container justifyContent='center' xs={8} sm={4}>
            {question.imageUrl ? <img src={question.imageUrl} alt="" width={'60%'} /> : <img className={classes.image} src={Placeholder} alt="Invalid URL" />}
          </Grid>
          <Grid container item xs={12} sm={12} style={{display: 'flex', alignItems: 'center', gap: 10, width: '100%'}}>
                  <Typography style={{ fontWeight: 200, fontSize: '1 rem', color: 'rgba(0,0,0,0.75)' }}> Game Type: </Typography>
                  <Box style={{ display: 'flex', justifyContainer: 'center', alignItems: 'center'}}>
                    <Typography style={{ fontWeight: 200, fontSize: '15px', color: 'rgba(0,0,0,0.75)' }}> Public </Typography>
                    <Radio
                      checked={publicPrivateQueryType === PublicPrivateType.PUBLIC} 
                      value={PublicPrivateType.PUBLIC} 
                      onChange={handlePublicPrivateChange} 
                      color='default'
                      disabled={gameId}
                    />
                  </Box>
                  <Box style={{display: 'flex', justifyContainer: 'center', alignItems: 'center'}}>
                    <Typography style={{ fontWeight: 200, fontSize: '15px', color: 'rgba(0,0,0,0.75)'}}> Private </Typography>
                    <Radio 
                      checked={publicPrivateQueryType === PublicPrivateType.PRIVATE} 
                      value={PublicPrivateType.PRIVATE} 
                      onChange={handlePublicPrivateChange} 
                      color='default'
                      disabled={gameId}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                { gameId &&
                    <Typography style={{ fontWeight: 200, fontSize: '15px', color: 'rgba(0,0,0,0.50)', fontStyle: "italic"}}> Question access type must match game access type </Typography>
                  }
                </Grid>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item container xs={9} sm={12}>
            {question.choices.sort((a, b) => Number(b.isAnswer) - Number(a.isAnswer)).map((choice, index) => (
              <QuestionMakerAnswerDropdown
                key={`choice${index}`}
                index={index}
                choice={choice}
                onChoiceTextChangeMaker={onChoiceTextChangeMaker}
                onChoiceReasonChangeMaker={onChoiceReasonChangeMaker}
                onStepChangeMaker={onStepChangeMaker}
                handleRemoveInstruction={handleRemoveInstruction}
                addInstruction={addInstruction}
                instructions={question?.instructions}
                answerType={answerType}
                setAnswerType={setAnswerType}
                answerPrecision={answerPrecision}
                setAnswerPrecision={setAnswerPrecision}
                isAnswerTypeValid={isAnswerTypeValid}
                isAnswerPrecisionValid={isAnswerPrecisionValid}
              />
            ))}
          </Grid>

          <Grid item container xs={12}>
            <Typography gutterBottom variant="h4" component="h1" style={{ marginRight: 30, display: 'inline' }}>Enter CCSS</Typography>

            <QuestionHelper />
          </Grid>

          <Grid item container xs={8} sm={12} justifyContent='space-between'>
            <div className={classes.dropdownWrapper}>
              <p>Grade Level*</p>
              <Select
                className={classes.dropdown}
                label="Grade Level"
                onChange={onSelectMaker('grade')}
                disableUnderline
                value={question.grade}
                required
                MenuProps={{ classes: { paper: classes.MenuProps } }}
              >
                <MenuItem value={null}>---</MenuItem>
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
                value={question.domain}
                required
                MenuProps={{ classes: { paper: classes.MenuProps } }}
              >
                <MenuItem value={null}>---</MenuItem>
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
                value={question.cluster}
                disableUnderline
                MenuProps={{ classes: { paper: classes.MenuProps } }}
              >
                <MenuItem value={null}>---</MenuItem>
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
                value={question.standard}
                disableUnderline
                MenuProps={{ classes: { paper: classes.MenuProps } }}
              >
                <MenuItem value={null}>---</MenuItem>
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

          <Grid style={{ marginTop: 50 }} item container xs={8} sm={12} justifyContent='center'>
            { !gameId 
              ?
                <Button className={classes.addGameButton} variant="contained" color="primary" onClick={() => handleSaveQuestionTemplate(question)}>{ match ? `Add to Queston Bank` : `Save Question` }</Button>
              :
                <Button className={classes.addGameButton} variant="contained" color="primary" onClick={() => handleSaveQuestionTemplate(question)}> { match ? `Add to Game` : `Save Question` } </Button>
            }
            </Grid>

        </Grid>

        <Grid container item xs={0} sm={2}></Grid>
      </Grid>
    </form>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '1%',
    paddingTop: '32px',
    paddingBottom: '10px',
    //maxWidth: '100vw',
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