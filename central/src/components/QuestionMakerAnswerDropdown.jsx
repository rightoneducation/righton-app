import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, Button, IconButton, TextField, List, ListItem, Box, RadioGroup, Radio, FormControlLabel } from "@material-ui/core";
import { ExpandMore, Add } from '@material-ui/icons';
import { AnswerType, AnswerPrecision } from '@righton/networking';

export default function QuestionMakerAnswerDropdown({
  choice,
  index,
  onChoiceTextChangeMaker,
  onChoiceReasonChangeMaker,
  addInstruction,
  handleRemoveInstruction,
  onStepChangeMaker,
  instructions,
  answerType,
  setAnswerType,
  answerPrecision,
  setAnswerPrecision,
  isAnswerTypeValid,
  isAnswerPrecisionValid
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const getAnswerText = (answerType) => {
    switch (answerType) {
      case (AnswerType.STRING):
        return 'Please ensure that your input is a valid string';
      case (AnswerType.NUMBER):
        return 'Please ensure that your input is a valid number. Allowable characters are: 0-9, -, .';
      case (AnswerType.EXPRESSION):
        return 'Please ensure that your input is a valid expression';
    }
  }
  const answerText = getAnswerText(answerType);
  // instructio s can be either null (when empty game is first started), [''] (when an empty instruction is passed back to this component), or an object (when a already created game is being editted)
  // TODO: clean up how we are handling instructions for more consistency
  const instructionsHandler = (instructions) => {
    if (!instructions)
      return null;
    else if (Array.isArray(instructions))
      return instructions;
    else
      return JSON.parse(instructions);
  }
  const instructionsArray = instructionsHandler(instructions);
  const handleOnTypeChange = (event) => {
    const newAnswerType = Number(event.target.value);
    setAnswerType(newAnswerType);
    onChoiceTextChangeMaker(index, newAnswerType, answerType)({ currentTarget: { value: choice.text } });
  };
  const handleOnPrecisionChange = (event) => {
    const newAnswerPrecision = Number(event.target.value);
    setAnswerPrecision(newAnswerPrecision);
  }
  return (
    <Grid item xs={12}>
      <Card className={choice.isAnswer ? classes.correctCard : classes.wrongCard}>
        <Box className={classes.correctCardBox}>
          <CardContent style={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 16, flexGrow: 1 }}>
              <Typography className={classes.answer}>{index === 0 ? 'Correct Answer:' : `Wrong Answer ${index}:`}</Typography>
              <TextField
                size="small"
                style={{ width: '100%', margin: 0, position: 'relative', left: 16, paddingRight: 16 }}
                id={`choice${index + 1}`}
                value={choice.text}
                onChange={onChoiceTextChangeMaker(index, answerType)}
                label="Type Answer Here"
                variant="outlined"
                required
              />
            </Box>
            <IconButton size='small' className={expanded ? classes.expanded : classes.expand} onClick={() => setExpanded(!expanded)}>
              <ExpandMore fontSize='large' />
            </IconButton>
          </CardContent>
          { index === 0 ? 
            <>
              <Box className={classes.answerTypeBox}> 
                <Typography className={classes.answerType}>{"Answer Type: "}</Typography>
                <RadioGroup value={String(answerType)} row onChange={(event) =>{ handleOnTypeChange(event)}}>
                  <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerType.NUMBER)}
                    control={<Radio className={classes.radioButton} />} 
                    label={'Number'} 
                  />
                  <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerType.STRING)}
                    control={<Radio className={classes.radioButton} />} 
                    label={'Text'} 
                  />
                    <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerType.EXPRESSION)}
                    control={<Radio className={classes.radioButton} />} 
                    label={'Mathematical Expression'} 
                  />
                </RadioGroup>
              </Box>
              {answerType === AnswerType.NUMBER ?
              <Box className={classes.answerTypeBox}> 
                <Typography className={classes.answerType}>{"Decimal Places: "}</Typography>
                <RadioGroup value={String(answerPrecision)} row onChange={(event) => handleOnPrecisionChange(event)}>
                  <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerPrecision.WHOLE)} 
                    control={<Radio className={classes.radioButton} />} 
                    label={'Ones (0)'} 
                  />
                  <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerPrecision.TENTH)} 
                    control={<Radio className={classes.radioButton} />} 
                    label={'Tenths (0.1)'} 
                  />
                  <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerPrecision.HUNDREDTH)} 
                    control={<Radio className={classes.radioButton} />} 
                    label={'Hundredths (0.01)'}
                  />
                  <FormControlLabel 
                    className={classes.radioLabel} 
                    value={String(AnswerPrecision.THOUSANDTH)}
                    control={<Radio className={classes.radioButton} />} 
                    label={'Thousandths (0.001)'}
                  />
                </RadioGroup>
              </Box>
             
              : null}
              <Box>   
                { !isAnswerTypeValid &&
                  <Typography style={{ fontStyle: 'italic' }}> {answerText} </Typography>
                }
                 { !isAnswerPrecisionValid &&
                  <Typography style={{ fontStyle: 'italic' }}> Please ensure the answer has the correct number of decimal places. </Typography>
                }
              </Box>
            </>
          : null} 
        </Box>
        <Collapse in={expanded}>
          <CardContent>
            <Typography className={classes.explanationTitle}>Explanation</Typography>
            {choice.isAnswer ? (
              <List>
                {instructionsArray && instructionsArray.map((step, index) => (
                  <React.Fragment key={index}>
                    <ListItem className={classes.instruction}>
                      <h1>{index + 1}.</h1>
                      <TextField className={classes.input} id={`step-${index + 1}`} value={step} onChange={onStepChangeMaker(index)} label="Write text here: Remember to be concise!" size="small" multiline rows={5} variant="outlined" required />
                      <Button className={classes.deleteButton} onClick={() => handleRemoveInstruction(index)}>X</Button>
                    </ListItem>
                  </React.Fragment>
                ))}
                <ListItem style={{ padding: 0 }}>
                  <Button className={classes.greenButton} startIcon={<Add style={{ width: 28, height: 28 }} />} variant="contained" onClick={addInstruction}>Add Step</Button>
                </ListItem>
              </List>
            ) : (
              <List>
                <ListItem className={classes.instruction}>
                  <TextField
                    className={classes.input}
                    value={choice.reason}
                    onChange={onChoiceReasonChangeMaker(index)}
                    label="Write text here: Remember to be concise!"
                    size="small"
                    multiline
                    rows={5}
                    variant="outlined"
                    required
                  />
                </ListItem>
              </List>
            )}
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  input: {
    margin: `${theme.spacing(2)}px 0`,
    width: '100%',
  },
  wrongCard: {
    borderRadius: '10px',
    boxShadow: '1px 4px 10px lightgrey',
    width: '90%',
    marginBottom: '20px',
  },
  correctCard: {
    borderRadius: '10px',
    boxShadow: '1px 4px 10px lightgrey',
    width: '90%',
    border: '5px solid #4DED66',
    marginBottom: '20px',
  },
  correctCardBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16
  },
  answerTypeBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 32,
  },
  answer: {
    fontWeight: 500,
    color: '#384466',
    fontSize: '18px',
    width: '160px'
  },
  answerType: {
    fontWeight: 500,
    color: '#384466',
    fontSize: '18px',
    width: '160px',
    padding: '7px 0'
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
  greenButton: {
    background: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
    borderRadius: 50,
    color: 'white',
    fontSize: 17,
  },  
  radioButton: {
    color: 'rgba(0, 0, 0, 0.50)',
    '&.Mui-checked': {
      color: 'rgba(0, 0, 0, 0.80)',
    },
  },
  radioLabel: {
    color: 'rgba(0, 0, 0, 0.50)',
  }
}));