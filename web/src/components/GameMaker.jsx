import { useState, useEffect } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, Divider, Grid, MenuItem, TextField, Typography, Card, CardContent } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import AddQuestionForm from './AddQuestionForm';
import QuestionForm from './QuestionForm';
import CCSS from './CCSS';
import GameCCSS from './GameCCSS';

// Mock question info
const mockQuestion = {
    id : '1389',
    text : "How many total squares (of any size) are there on a checkerboard?",
    answer: '204 squares',
    imageUrl: 'https://media.istockphoto.com/photos/wooden-chess-board-picture-id476469645?s=612x612',
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

// New "empty" game
const newGame = {
    title: '',
    description: '',
    grade: '',
    domain: '',
    phaseOneTime: 180,
    phaseTwoTime: 180,
    imageUrl: '',
    questions: [ mockQuestion ],
}

// Preset times
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
        value: 180,
        label: '3:00',
    },
    {
        value: 300,
        label: '5:00',
    },
    {
        value: 600,
        label: '10:00',
    },
]

export default function GameMaker({game, newSave, editSave, gamemakerIndex, cloneQuestion, games}) {
    useEffect(() => {
        document.title = 'RightOn! | Game editor';
        return () => { document.title = 'RightOn! | Game management'; }
    }, []);

    const classes = useStyles();
    const history = useHistory();
    const match = useRouteMatch('/gamemaker/:gamemakerIndex');
    console.log(match)

    const [gameDetails, setGameDetails] = useState(() => {
        if (game) {
            return {...game};
        }
        else {
            return newGame;
        }
    });
    const [phaseOne, setPhaseOne] = useState(() => {
        if (gameDetails.phaseOneTime == null) {
            return 180;
        }
        else {
            return gameDetails.phaseOneTime;
        }
    });
    const [phaseTwo, setPhaseTwo] = useState(() => {
        if (gameDetails.phaseTwoTime == null) {
            return 180;
        }
        else {
            return gameDetails.phaseTwoTime;
        }
    });
    const [questions, setQuestions] = useState([...gameDetails.questions]);

    // Handles changing and storing of new values for both Phase Timers
    const handlePhaseOne = (event) => {
        setPhaseOne(event.target.value);
        setGameDetails({ ...gameDetails, phaseOneTime: phaseOne });
    };
    const handlePhaseTwo = (event) => {
        setPhaseTwo(event.target.value);
        setGameDetails({ ...gameDetails, phaseTwoTime: event.target.value });
    };

    // Handles changing the Game CCSS code when the question set is changed/updated
    function handleCCSS(grade, domain) {
        setGameDetails({ ...gameDetails, grade: grade, domain: domain });
    }

    // Handles deletion of Question in the Question set of a Game (does not remove it on the backend, just removes it from the copy of the array of Questions that will then be saved as new connections to the Game in the handleSubmit function)
    const handleDelete = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    }

    // Handles any new questions added to the game, either through Add Question or Create Question
    const handleSaveQuestion = (newQuestion) => {
        setQuestions([ ...questions, newQuestion ])
    };

    // Handles if the Save Game button is disabled. The button become enabled when all required fields have values in it. The required fields/values are the game's title, description, and 4+ questions.
    const handleDisable = () => {
        if (gameDetails.title && questions.length >= 1) {
            return false;
        }
        else {
            return true;
        }
    }

    // Save New or Exisiting Game (preliminary submit)
    const handleSubmit = (event) => {
        if (gameDetails.id) {
            let questionIDs = questions.map(question => ({id: question.id}))
            delete gameDetails.questions
            editSave(gameDetails, questionIDs);
        }
        else {
            let questionIDs = questions.map(question => question.id)
            delete gameDetails.questions
            newSave(gameDetails, questionIDs);
        }
        event.preventDefault();
        history.push('/');
    };

    let content = (
        <div className={match.isExact ? classes.show : classes.hide}>
            <form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid container item xs={2}></Grid>
                    
                    <Grid item container xs={8} className={classes.page}>
                        <Grid container item xs={12} className={classes.game}>
                            <Grid container item xs={12}>
                                <Typography style={{fontWeight: 500, fontSize: '20px'}}>
                                    Create Game
                                </Typography>
                            </Grid>

                            <Grid container item xs={12}>
                                <Typography style={{fontWeight: 700, fontSize: '16px', color: '#FC1047', paddingBottom: '10px'}}>
                                    Note: In order for this game to be playable in advanced mode, there must be a minimum of 5 questions.
                                </Typography>
                            </Grid>

                            <Grid container item xs={12}>
                                <Grid container item xs={8}>
                                    <Grid container item xs={12}>
                                        <TextField
                                            variant='outlined'
                                            label='Game Title'
                                            value={gameDetails.title}
                                            onChange={({ currentTarget }) => { setGameDetails({ ...gameDetails, title: currentTarget.value }); }}
                                            fullWidth
                                            required
                                            className={classes.gameTitle}
                                        />
                                    </Grid>

                                    <Grid container item xs={12}>
                                        <TextField
                                            variant='outlined'
                                            label='Game Text'
                                            value={gameDetails.description}
                                            onChange={({ currentTarget }) => { setGameDetails({ ...gameDetails, description: currentTarget.value }); }}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            className={classes.gameText}
                                        />
                                    </Grid>

                                    <Grid container item xs={12} className={classes.thirdRow}>
                                        <Grid container item xs={2}>
                                            <TextField
                                                variant='outlined'
                                                select
                                                label='Phase 1'
                                                value={phaseOne}
                                                onChange={handlePhaseOne}
                                            >
                                                {times.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>

                                        <Grid container item xs={2}>
                                            <TextField
                                                variant='outlined'
                                                select
                                                label='Phase 2'
                                                value={phaseTwo}
                                                onChange={handlePhaseTwo} 
                                            >
                                                {times.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>

                                        <Grid container item xs={8}>
                                            <TextField
                                                variant='outlined'
                                                label='Image URL'
                                                fullWidth
                                                value={gameDetails.imageUrl}
                                                onChange={({ currentTarget }) => { setGameDetails({ ...gameDetails, imageUrl: currentTarget.value }); }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container item xs={4} justifyContent='center'>
                                    {gameDetails.imageUrl ? <img src={gameDetails.imageUrl} alt="" width={'60%'} /> : <img src={RightOnPlaceHolder} alt="Placeholder" height={'275px'}/>}
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
                                    To add an exisiting question from another game into this one, click the Add Question button. To create a new question, click the Create Question button. Once you have added a question to the game, the question will appear in the space below.
                                </Typography>
                            </Grid>

                            <Grid container item xs={12} className={classes.questionHolder}>
                                {questions.map((question, index) => {
                                    return(
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
                                                                Question {index + 1}
                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Typography color="textSecondary" gutterBottom>
                                                                {question.text}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container item xs={2}>
                                                            <Grid container item xs={10} justifyContent='center'>
                                                                {question.imageUrl ? <img className={classes.image} src={question.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" height={'128px'}/>}
                                                            </Grid>

                                                            <Grid container direction='column' item xs={2}>
                                                                <Grid container item xs={2}>
                                                                    <IconButton size='small' onClick={() => handleDelete(index)}>
                                                                        <Cancel/>
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}

                                <Grid container item xs={12} className={classes.questionAddition}>
                                    <Grid container item xs={6} justifyContent='center' className={classes.addQuestion}>
                                        <Button variant='contained' disableElevation className={classes.blueButton} onClick={() => history.push(`/gamemaker/${gamemakerIndex}/addquestion`)}>
                                            Add Question
                                        </Button>
                                    </Grid>

                                    <Grid container item xs={6} justifyContent='center' className={classes.createQuestion}>
                                        <Button variant='contained' disableElevation className={classes.greenButton} onClick={() => history.push(`/gamemaker/${gamemakerIndex}/createquestion/0`)}>
                                            Create Question
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {() => {
                            if (questions == []) {
                                return ( <Grid container item xs={12}></Grid> );
                            }
                            else {
                                return (<GameCCSS questions={questions} handleCCSS={handleCCSS}/>);
                            }
                        }}

                        <Grid container item xs={12} justifyContent='center'>
                            <Button variant='contained' type='submit' disabled={handleDisable()} disableElevation className={classes.greenButton}>
                                Save Game
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container item xs={2}></Grid>
                </Grid>
            </form>
        </div>
    )

    return(
        <Switch>
            <Route exact path="/gamemaker/:gamemakerIndex">
                {content}
            </Route>
            <Route path="/gamemaker/:gamemakerIndex/addquestion">
                <AddQuestionForm games={games} cloneQuestion={cloneQuestion} submit={handleSaveQuestion} gamemakerIndex={gamemakerIndex}/>
            </Route>
            <Route path="/gamemaker/:gamemakerIndex/createquestion/:createQuestionIndex" render={
                ({ match }) => {
                const { gamemakerIndex, createQuestionIndex } = match.params;
                const gameNumber = Number(gamemakerIndex) - 1 == -1;
                return <QuestionForm question={gameNumber ? null : games[Number(gamemakerIndex) - 1].questions[Number(createQuestionIndex) - 1]} saveQuestion={handleSaveQuestion} gamemakerIndex={gamemakerIndex}/>;
                }
            } />
        </Switch>
    );
}

const useStyles = makeStyles(theme => ({
    show: {
        display: 'block'
    },
    hide: {
        display: 'none'
    },
    page: {
        marginTop: '1%',
        paddingBottom: '10px',
    },
            gameTitle: {
                paddingTop: '10px',
                paddingBottom: '10px',
            },
            gameText: {
                paddingTop: '10px',
                paddingBottom: '10px',
            },
            thirdRow: {
                paddingTop: '10px',
                paddingBottom: '10px',
            },
        divider: {
            height: '1px',
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
                marginTop: '10px',
                marginBottom: '10px',
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
                        maxHeight: '128px',
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
                            '&:disabled': {
                                background: 'linear-gradient(180deg, #D4D4D4 0%, #9F9F9F 100%)',
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontSize: '17px',
                                fontWeight: 500,
                                color: 'white',
                                cursor: 'not-allowed',
                            },
                        },
}));