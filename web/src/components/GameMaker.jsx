import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, Checkbox, Divider, FormControlLabel, Grid, MenuItem, TextField, Typography, Card, CardContent } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import CCSS from './CCSS';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import { Route, useHistory } from 'react-router-dom';
import AddQuestionForm from './AddQuestionForm';

const newGame = {
    title: '',
    description: '',
    grade: '',
    domain: '',
    cluster: '',
    standard: '',
    phaseOneTime: 60,
    phaseTwoTime: 120,
    imageUrl: '',
}

const question = {
    id : '8',
    text : "How many total squares (of any size) are there on a checkerboard?",
    answer: '204 squares',
    imageURL: 'https://media.istockphoto.com/photos/wooden-chess-board-picture-id476469645?s=612x612',
    grade: '7',
    domain: 'G',
    cluster: 'B',
    standard: '6',
    instructions: 'To get this answer, you not only need to count all of the 1x1 squares, but you need to consider the 2x2, 3x3, 4x4, etc. all the way up to the full 8x8 square. Counting every one of those squares together will return a sum of 204 total squares.',
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

export default function GameMaker({games, cloneQuestion}) {
    const classes = useStyles();
    const [gameDetails, setGameDetails] = React.useState(newGame)
    const [phaseOne, setPhaseOne] = React.useState(60);
    const [phaseTwo, setPhaseTwo] = React.useState(120);
    const [questions, setQuestions] = useState([question])

    const handlePhaseOne = (event) => {
        setPhaseOne(event.target.value);
    };
    const handlePhaseTwo = (event) => {
        setPhaseTwo(event.target.value);
    };

    const handleSubmitQuestion = (newQuestion) => {
        setQuestions([ ...questions, newQuestion ])
    }

    const history = useHistory();

    const copyQuestion = () => history.push(`/gamemaker/addquestion`);

    const times = [
        {
            value: 60,
            label: '1:00',
        },
        {
            value: 120,
            label: '2:00',
        },
        {
            value: 300,
            label: '5:00',
        },
        {
            value: 600,
            label: '10:00',
        },
    ];

     
    const CCSSSuggestion = '7.Misc.'

    let content = (
        <Grid container>
            <Grid container xs={2}></Grid>

            <Grid container xs={8} className={classes.page}>
                <Grid container item xs={12} className={classes.game}>
                    <Grid container item xs={12}>
                        <Typography style={{fontWeight: 500, fontSize: '20px'}}>
                            Create Game
                        </Typography>
                    </Grid>

                    <Grid container item xs={12}>
                        <Typography style={{fontWeight: 700, fontSize: '16px', color: '#FC1047'}}>
                            Note: In order for this game to be playable in advanced mode, there must be a minimum of 5 questions.
                        </Typography>
                    </Grid>

                    <Grid container item xs={12}>
                        <Grid container item xs={6}>
                            <Grid container item xs={12}>
                                <TextField variant='outlined' label='Game Title' className={classes.gameTitle}/>
                            </Grid>

                            <Grid container item xs={12}>
                                <TextField variant='outlined' label='Game Text' className={classes.gameText}/>
                            </Grid>

                            <Grid container item xs={6} className={classes.phaseOne}>
                                <TextField variant='outlined' select='true' label='Phase 1' value={phaseOne} onChange={handlePhaseOne}>
                                    {times.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid container item xs={6} className={classes.phaseTwo}>
                                <TextField variant='outlined' select='true' label='Phase 2' value={phaseTwo} onChange={handlePhaseTwo}>
                                    {times.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid container item xs={6}>
                            <Grid container item xs={12} justifyContent='center'>
                                <img src={RightOnPlaceHolder} alt="Placeholder" width={'25%'}/>
                            </Grid>

                            <Grid container item xs={12} justifyContent='center' className={classes.url}>
                                <TextField variant='outlined' label='Image URL'/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item xs={12}>
                    <Divider className={classes.divider}/>
                </Grid>

                <Grid container item xs={12}>
                    <Grid container item xs={12}>
                        <Typography style={{fontWeight: 400, fontSize: '20px'}}>
                            Questions
                        </Typography>
                    </Grid>

                    <Grid container item xs={12}>
                        <Typography style={{fontWeight: 400, fontSize: '14px', color: '#A7A7A7'}}>
                            Click and drag a quesstion from the left side area into the space below to add it to the game, you can also click the + button on each question to immediately add it to the game as well.
                        </Typography>
                    </Grid>

                    <Grid container item xs={12} className={classes.questionHolder}>
                        <Grid container item xs={12}>
                            <Card className={classes.question}>
                                <CardContent>
                                    <Grid container item>
                                        <Grid container item xs={10}>
                                            <Grid item xs={12}>
                                                <CCSS grade={question.grade} domain={question.domain} cluster={question.cluster} standard={question.standard} />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography className={classes.title}>
                                                Question 1
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography color="textSecondary" gutterBottom>
                                                {question.text}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container item xs={2}>
                                            <Grid container item xs={10}>
                                                {question.imageURL ? <img className={classes.image} src={question.imageURL} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" width={'100%'}/>}
                                            </Grid>

                                            <Grid container direction='column' item xs={2}>
                                                <Grid container item xs={2}>
                                                    <IconButton size='small'>
                                                        <Cancel/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid container item xs={12} className={classes.questionAddition}>
                            <Grid container item xs={6} justifyContent='center' className={classes.addQuestion}>
                                <Button className={classes.blueButton} color="primary" type="button" variant="contained" onClick={copyQuestion}>
                                    Add Question
                                </Button>
                            </Grid>

                            <Grid container item xs={6} justifyContent='center' className={classes.createQuestion}>
                                <Button variant='contained' disableElevation className={classes.greenButton}>
                                    Create Question
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container item xs={12} className={classes.standards}>
                    <Grid container item xs={7} className={classes.gameCCSS}>
                        <Typography style={{fontWeight: 400, fontSize: '20px'}}>
                            CCSS Suggestion: {CCSSSuggestion}
                        </Typography>
                    </Grid>

                    <Grid container item xs={5} className={classes.standardsAligned}>
                        <FormControlLabel control={<Checkbox/>} label='Standards Aligned?'/>
                    </Grid>
                </Grid>

                <Grid container item xs={12} justifyContent='center'>
                    <Button variant='contained' disableElevation className={classes.greenButton}>
                        Save Game
                    </Button>
                </Grid>
            </Grid>

            <Grid container xs={2}></Grid>
        </Grid>
    )
if (history.location.pathname = "/gamemaker/addquestion"){
    content = (
        <Route path="/gamemaker/addquestion" render={
            ({ match }) => {
            return <AddQuestionForm games={games} cloneQuestion={cloneQuestion} submit={handleSubmitQuestion} {...match.params}/>;
            }
        } />
    )
}
    

    return(
        content
    );
}

const useStyles = makeStyles(theme => ({
    page: {
        marginTop: '2%',
    },
            gameTitle: {
                paddingTop: '10px',
                paddingBottom: '10px',
                width: '100%',
            },
            gameText: {
                paddingTop: '10px',
                paddingBottom: '10px',
                width: '100%',
            },
            phaseOne: {
                paddingTop: '10px',
                paddingBottom: '10px',
                width: '100%',
            },
            phaseTwo: {
                paddingTop: '10px',
                paddingBottom: '10px',
            },
            url: {
                paddingTop: '10px',
                paddingBottom: '10px',
            },
        divider: {
            height: '2px',
            width: '100%',
            marginBottom: '10px',
            marginTop: '10px',
            backgroundColor: '#A7A7A7',
        },
            questionHolder: {
                background: '#E0E0E0',
                border: '1px solid #BDBDBD',
                borderRadius: '14px',
                padding: '3%',
            },
                question: {
                    width: '100%',
                    borderRadius: '10px',
                    marginBottom: theme.spacing(2),
                    height: '152px',
                    boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
                },
                    title: {
                        fontWeight: 700,
                        fontSize: '110%',
                        color: '#384466',
                    },
                    image: {
                        width: '80%',
                    },
                questionAddition: {
                    border: '5px solid #C4C4C4',
                    borderRadius: '18px',
                    paddingTop: '3%',
                    paddingBottom: '3%',
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
}));