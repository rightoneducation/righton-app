import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, Button, IconButton, Paper, Divider } from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';

export default function QuestionDetails({gameIndex, gameTitle, questionIndex, question}) {
    const classes = useStyles();
    const history = useHistory();
    const [expanded, setExpanded] = useState(false);

    // console.log(question.wrongAnswer)
    // const question = {
    //     id : '8',
    //     text : "How many total squares (of any size) are there on a checkerboard?",
    //     answer: '204 squares',
    //     imageURL: 'https://media.istockphoto.com/photos/wooden-chess-board-picture-id476469645?s=612x612',
    //     instructions: 'To get this answer, you not only need to count all of the 1x1 squares, but you need to consider the 2x2, 3x3, 4x4, etc. all the way up to the full 8x8 square. Counting every one of those squares together will return a sum of 204 total squares.',
    // }
    const wrongAnswers = {
        choices : [
            'Wrong Answer 1',
            'Wrong Answer 2',
            'Wrong Answer 3',
        ],
        explanations : [
            'wrong choice explanation 1',
            'wrong choice explanation 2',
            'wrong choice explanation 3',
        ]
    }

    return(
        <Grid container>
            <Grid item xs={12}>
                <Button type="button" onClick={() => history.push(`/games/${gameIndex}`)}>
                    <ArrowBackIcon className={classes.back} />Back to {gameTitle}
                </Button>
            </Grid>

            <Grid container item xs={6}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>
                        Question {Number(questionIndex)+1}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography className={classes.question} gutterBottom>
                        {question.text}
                    </Typography>
                </Grid>

                <Grid container item xs={12} alignItems='center' justify='center'>
                    {question.imageUrl ? <img className={classes.image} src={question.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} width={'60%'}/>}
                </Grid>
            </Grid>

            <Grid container item xs={6}>
                <Grid item xs={12}>
                    <Typography className={classes.answerTitle}>
                        Answers
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Paper className={classes.correctCard}>
                        <CardContent>
                            <Typography className={classes.answer}>
                                {question.answer}
                            </Typography>
                        
                            <IconButton size='small' className={expanded ? classes.expanded : classes.expand} expand={expanded} onClick={() => setExpanded(!expanded)}>
                                <ExpandMore fontSize='large'/>
                            </IconButton>
                        </CardContent>

                        <Collapse in={expanded}>
                            <CardContent>
                                <Typography className={classes.explanationTitle}>
                                    Explanation:
                                </Typography>
                                <Typography className={classes.explanationText}>
                                    {question.instructions}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Divider className={classes.divider}/>
                </Grid>

                {wrongAnswers.choices.map((choice, index) => {
                    return(
                        <Grid item xs={12}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography className={classes.answer}>
                                        {choice}
                                    </Typography>
                                
                                    <IconButton size='small' className={expanded ? classes.expanded : classes.expand} expand={expanded} onClick={() => setExpanded(!expanded)}>
                                        <ExpandMore fontSize='large'/>
                                    </IconButton>
                                </CardContent>

                                <Collapse in={expanded}>
                                    <CardContent>
                                        <Typography className={classes.explanationTitle}>
                                            Explanation:
                                        </Typography>
                                        <Typography className={classes.explanationText}>
                                            {wrongAnswers.explanations[index]}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    back: {
        marginRight: theme.spacing(1),
    },
    title: {
      fontWeight: 700,
      color: '#0075FF',
      textAlign: 'center',
      fontSize: '24px',
    },
    answerTitle: {
        fontWeight: 700,
        color: '#0075FF',
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '10px',
    },
    question: {
        fontWeight: 500,
        color: '#000000',
        textAlign: 'center',
        fontSize: '20px',
        marginLeft: '20px',
        marginRight: '20px',
    },
    image: {
        width: 'auto',
        maxWidth: '70%',
        height: 'auto',
        maxHeight: '90%',
    },
    square: {
        height: '450px',
        width: '450px',
        borderRadius: '10px',
    },
    divider: {
        height: '2px',
        backgroundColor: '#B5B5B5',
        marginBottom: '20px',
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
        width: '100%',
        border: '5px solid #4DED66',
        marginBottom: '20px',
    },
    answer: {
        fontWeight: 500,
        color: '#384466',
        fontSize: '30px',
        display: 'inline',
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
    explanationText: {
        fontWeight: 500,
        fontSize: '14px',
        color: '#384466',
    },
  }));