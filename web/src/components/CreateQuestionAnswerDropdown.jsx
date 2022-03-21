import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, IconButton, TextField, List, ListItem, Button } from "@material-ui/core";
import { ExpandMore, Add } from '@material-ui/icons';

export default function QuestionFormAnswerDropdown({question, correct, onChangeMaker, onStepChangeMaker, handleRemoveInstruction, addInstruction, wrongAnswersIndex, onWrongChoiceChangeMaker, onWrongExplanationChangeMaker}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    if(correct) {
        return(
            <Grid item xs={12}>
                <Card className={classes.correctCard}>
                    <CardContent style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography className={classes.answer}>
                            {"Correct Answer:"}
                        </Typography>
                        <TextField size="small" style={{width: 700, margin: 0}} id={"answer"} value={question.answer} onChange={onChangeMaker('answer')} label="Type Answer Here" variant="outlined" required />
                        <IconButton size='small' className={expanded ? classes.expanded : classes.expand} onClick={() => setExpanded(!expanded)}>
                            <ExpandMore fontSize='large' />
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
                                <ListItem style={{padding: 0}}>
                                    <Button className={classes.greenButton} startIcon={<Add style={{width: 28, height: 28}} />} variant="contained" onClick={addInstruction}>Add Step</Button>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        );
    }
    else {
        return(
            <Grid item xs={12}>
                <Card className={classes.wrongCard}>
                    <CardContent style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography className={classes.answer}>
                            {`Wrong Answer ${wrongAnswersIndex + 1}:`}
                        </Typography>
                        <TextField size="small" style={{width: 700, margin: 0}} id={`wrongAnswers${wrongAnswersIndex + 1}`} value={question.wrongAnswers[wrongAnswersIndex].choice} onChange={onWrongChoiceChangeMaker(wrongAnswersIndex)} label="Type Answer Here" variant="outlined" required />
                        <IconButton size='small' className={expanded ? classes.expanded : classes.expand} onClick={() => setExpanded(!expanded)}>
                            <ExpandMore fontSize='large' />
                        </IconButton>
                    </CardContent>

                    <Collapse in={expanded}>
                        <CardContent>
                            <Typography className={classes.explanationTitle}>
                                Explanation
                            </Typography>
                            <List>
                                <ListItem className={classes.instruction}>
                                    <TextField className={classes.input} value={question.wrongAnswers[wrongAnswersIndex].explanation} onChange={onWrongExplanationChangeMaker(wrongAnswersIndex)} label="Write text here: Remember to be concise!" size="small" multiline rows={5} variant="outlined" required />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        );
    }
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
}));