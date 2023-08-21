import { isNullOrUndefined } from '@righton/networking';
import React, { useState, useEffect } from 'react';
import {
  Route,
  useNavigate,
  useParams,
  Routes,
  useLocation,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  IconButton,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';
import { Cancel, QuestionAnswerSharp } from '@material-ui/icons';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
import AddQuestionForm from './AddQuestionSidebar';
import QuestionForm from './CreateQuestion';
import CCSS from './CCSS';
import GameCCSS from './GameMakerCCSS';
import { getGameById } from '../lib/games';
import AddQuestion from './AddQuestion';

export default function GameMaker({
  loading,
  newSave,
  editSave,
  cloneQuestion,
  games,
  updateQuestion,
  handleSearchClick,
}) {
  // New "empty" game
  const newGame = {
    id: 0,
    title: '',
    description: '',
    grade: '',
    domain: '',
    phaseOneTime: 180,
    phaseTwoTime: 180,
    imageUrl: '',
    questions: [],
  };

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
  ];

  const classes = useStyles();
  const history = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const { gameId } = useParams();

  const [gameDetails, setGameDetails] = useState(() => {
    const game = getGameById(games, gameId);
    if (game) {
      return { ...game };
    }

    console.error('Game not found', gameId);
    return newGame;
  });

  const [phaseOne, setPhaseOne] = useState(() => {
    if (isNullOrUndefined(gameDetails)) {
      return 180;
    }

    return gameDetails.phaseOneTime;
  });

  const [phaseTwo, setPhaseTwo] = useState(() => {
    if (isNullOrUndefined(gameDetails)) {
      return 180;
    }

    return gameDetails.phaseTwoTime;
  });

  const [questions, setQuestions] = useState([...gameDetails.questions]);

  const location = useLocation();
  const { question } = location.state || {};

  useEffect(() => {
    if (!isNullOrUndefined(question)) {
      gameDetails.questions = [...gameDetails.questions, question];
      setQuestions(gameDetails.questions);
    }
  }, [question, question?.id]);

  useEffect(() => {
    document.title = 'RightOn! | Game editor';
    handleSearchClick(false);
    return () => {
      document.title = 'RightOn! | Game management';
    };
  }, []);

  // Handles changing and storing of new values for both Phase Timers
  const handlePhaseOne = (event) => {
    setPhaseOne(event.target.value);
    setGameDetails({ ...gameDetails, phaseOneTime: event.target.value });
  };

  const handlePhaseTwo = (event) => {
    setPhaseTwo(event.target.value);
    setGameDetails({ ...gameDetails, phaseTwoTime: event.target.value });
  };

  // Handles changing the Game CCSS code when the question set is changed/updated
  function handleCCSS(grade, domain, cluster, standard) {
    setGameDetails({
      ...gameDetails,
      grade,
      domain,
      cluster,
      standard,
    });
  }

  // Handles deletion of Question in the Question set of a Game (does not remove it on the backend, just removes it from the copy of the array of Questions that will then be saved as new connections to the Game in the handleSubmit function)
  const handleDelete = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Handles any new questions added to the game, either through Add Question or Create Question
  const handleGameQuestion = (newQuestion) => {
    setDisabled(isButtonDisabled());
    for (let i = 0; i < questions.length; i++) {
      if (newQuestion.id === questions[i].id) {
        questions[i] = newQuestion;
        return null;
      }
    }
    setQuestions([...questions, newQuestion]);
  };

  // Handles if the Save Game button is disabled. The button become enabled when all required fields have values in it. The required fields/values are the game's title, description, and 4+ questions.
  const isButtonDisabled = () => {
    return !(
      gameDetails.title.length > 0 &&
      gameDetails.description.length > 0 &&
      gameDetails.imageUrl.length > 0
    );
  };

  // Save New or Existing Game (preliminary submit)
  const handleSubmit = (event) => {
    if (gameDetails.id !== 0) {
      gameDetails.questions = questions;
      editSave(gameDetails);
    } else {
      delete gameDetails.id;
      newSave(gameDetails);
    }
    event.preventDefault();
    history('/');
  };

  const handleStringInput = (value) => {
    const newString = value.replace(/\'/g, '\u2019');
    return newString;
  };

  const content = (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container item xs={1} sm={2} />

          <Grid item container xs={10} sm={8} className={classes.page}>
            <Grid container item xs={12} className={classes.game}>
              <Grid container item xs={12}>
                <Typography style={{ fontWeight: 500, fontSize: '20px' }}>
                  Create Game
                </Typography>
              </Grid>

              <Grid container item xs={12}>
                <Typography
                  style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#FC1047',
                    paddingBottom: '10px',
                  }}
                >
                  Note: In order for this game to be playable in advanced mode,
                  there must be a minimum of 5 questions.
                </Typography>
              </Grid>

              <Grid container item xs={12}>
                <Grid container item xs={12} sm={8}>
                  <Grid container item xs={12}>
                    <TextField
                      variant="outlined"
                      label="Game Title"
                      value={gameDetails.title}
                      onChange={({ currentTarget }) => {
                        setGameDetails({
                          ...gameDetails,
                          title: handleStringInput(currentTarget.value),
                        });
                        setDisabled(isButtonDisabled());
                      }}
                      fullWidth
                      required
                      className={classes.gameTitle}
                    />
                  </Grid>

                  <Grid container item xs={12}>
                    <TextField
                      variant="outlined"
                      label="Game Text"
                      value={gameDetails.description}
                      onChange={({ currentTarget }) => {
                        setGameDetails({
                          ...gameDetails,
                          description: handleStringInput(currentTarget.value),
                        });
                        setDisabled(isButtonDisabled());
                      }}
                      fullWidth
                      multiline
                      minRows={3}
                      className={classes.gameText}
                    />
                  </Grid>

                  <Grid container item xs={12} className={classes.thirdRow}>
                    <Grid container item xs={3} sm={2}>
                      <TextField
                        variant="outlined"
                        select
                        label="Phase 1"
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

                    <Grid container item xs={3} sm={2}>
                      <TextField
                        variant="outlined"
                        select
                        label="Phase 2"
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

                    <Grid container item xs={6} sm={8}>
                      <TextField
                        variant="outlined"
                        label="Image URL"
                        fullWidth
                        value={gameDetails.imageUrl}
                        onChange={({ currentTarget }) => {
                          setGameDetails({
                            ...gameDetails,
                            imageUrl: currentTarget.value,
                          });
                          setDisabled(false && handleDisable());
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container item xs={12} sm={4} justifyContent="center">
                  {gameDetails.imageUrl ? (
                    <img src={gameDetails.imageUrl} alt="" width="60%" />
                  ) : (
                    <img
                      src={RightOnPlaceHolder}
                      alt="Placeholder"
                      height="275px"
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>

            <Grid container item xs={12}>
              <Grid container item xs={12}>
                <Typography style={{ fontWeight: 400, fontSize: '20px' }}>
                  Questions
                </Typography>
              </Grid>

              <Grid container item xs={12}>
                <Typography
                  style={{
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#A7A7A7',
                  }}
                >
                  To add an existing question from another game into this one,
                  click the Add Question button. To create a new question, click
                  the Create Question button. Once you have added a question to
                  the game, the question will appear in the space below.
                </Typography>
              </Grid>

              <Grid container item xs={12} className={classes.questionHolder}>
                {questions.map((question, index) => (
                  <Grid key={question.id} container item xs={12}>
                    <Card className={classes.question}>
                      <CardContent>
                        <Grid container item>
                          <Grid container item xs={10}>
                            <Grid item xs={12}>
                              <CCSS
                                grade={question.grade}
                                domain={question.domain}
                                cluster={question.cluster}
                                standard={question.standard}
                              />
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
                            <Grid
                              container
                              item
                              xs={10}
                              justifyContent="center"
                            >
                              {question.imageUrl ? (
                                <img
                                  className={classes.image}
                                  src={question.imageUrl}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={RightOnPlaceHolder}
                                  alt="Placeholder"
                                  height="128px"
                                />
                              )}
                            </Grid>

                            <Grid container direction="column" item xs={2}>
                              <Grid container item xs={2}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(index)}
                                >
                                  <Cancel />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                <Grid
                  container
                  item
                  xs={12}
                  className={classes.questionAddition}
                >
                  <Grid container item xs={6} justifyContent="center">
                    <Button
                      variant="contained"
                      disableElevation
                      className={classes.blueButton}
                      onClick={() =>
                        history(`/gamemaker/${gameDetails.id}/addquestion`, {
                          state: {
                            gameDetails,
                          },
                        })
                      }
                    >
                      Add Question
                    </Button>
                  </Grid>

                  <Grid container item xs={6} justifyContent="center">
                    <Button
                      variant="contained"
                      disableElevation
                      className={classes.greenButton}
                      onClick={() =>
                        history(`/gamemaker/${gameDetails.id}/createquestion`, {
                          state: {
                            game: gameDetails,
                          },
                        })
                      }
                    >
                      Create Question
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {questions.length > 0 ? (
              <GameCCSS
                questions={questions}
                handleCCSS={handleCCSS}
                currentGameGrade={gameDetails.grade}
              />
            ) : (
              <Grid container item xs={12} />
            )}

            <Grid container item xs={12} justifyContent="center">
              <Button
                variant="contained"
                type="submit"
                disabled={disabled}
                disableElevation
                className={classes.greenButton}
              >
                Save Game
              </Button>
            </Grid>
          </Grid>

          <Grid container item xs={1} sm={2} />
        </Grid>
      </form>
    </div>
  );

  return (
    <Routes>
      <Route
        path="/addquestion"
        element={
          <AddQuestionForm
            loading={loading}
            games={games}
            cloneQuestion={cloneQuestion}
            submit={handleGameQuestion}
            gameId={gameId}
          />
        }
      >
        <Route
          path="/addquestion/gameSelected/:selectedGameId"
          exact="true"
          element={
            <AddQuestion
              games={games}
              cloneQuestion={cloneQuestion}
              submit={handleGameQuestion}
              getGameById={getGameById}
            />
          }
        />
        <Route
          index
          element={
            <Grid
              style={{
                height: 'calc(100vh - 64px)',
              }}
            >
              <p style={{ color: '#797979', fontWeight: 'bold' }}>
                No Game Selected
              </p>

              <h2
                style={{
                  width: '60%',
                  color: '#797979',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '30%',
                }}
              >
                In order to view questions, you must select a game from the
                section on the left
              </h2>
            </Grid>
          }
        />
      </Route>

      <Route
        path="/createquestion"
        element={
          <QuestionForm
            onChange={() => setDisabled(isButtonDisabled())}
            updateQuestion={updateQuestion}
            cloneQuestion={cloneQuestion}
            gameQuestion={handleGameQuestion}
            updateGame={(game) => {
              setGameDetails(game);
              setQuestions(game.questions);
            }}
          />
        }
      />

      <Route path="*" element={content} />
    </Routes>
  );
}

const useStyles = makeStyles((theme) => ({
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
