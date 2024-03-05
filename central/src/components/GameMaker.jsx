import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, Divider, Grid, MenuItem, TextField, Typography, Card, CardContent, Box } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { isNullOrUndefined } from '@righton/networking';
import RightOnPlaceHolder from './../images/RightOnPlaceholder.svg';
import CCSS from './CCSS';
import GameCCSS from './GameMakerCCSS';
import QuestionMaker from './QuestionMaker';
import { getQuestionTemplateById } from '../lib/HelperFunctions';
import SearchBar from './SearchBar.jsx';
import SortByDropdown from './SortByDropdown';
import QuestionDashboard from './QuestionDashboard';
import { v4 as uuidv4 } from 'uuid';

// New "empty" game
const newGame = {
  id: uuidv4(),
  title: '',
  description: '',
  grade: '',
  domain: '',
  phaseOneTime: 180,
  phaseTwoTime: 180,
  imageUrl: '',
  questionTemplates: [],
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

export default function GameMaker({ 
  loading,
  questions, 
  game,
  games, 
  handleQuestionBankClick, 
  selectedQuestions, 
  setSelectedQuestions, 
  saveGameTemplate, 
  isUserAuth,
  handleCreateQuestionTemplate,
  handleUpdateQuestionTemplate,
  setSearchInput,
  searchInput, 
  isSearchClick, 
  handleSearchClick,
  handleSearchChange, 
  isResolutionMobile, 
  listQuerySettings,
  handleUpdateListQuerySettings,
  sortByCheck, 
  setSortByCheck, 
  cloneQuestion,
  gameId,
  handleScrollDown,
  handleQuestionSelected,
  nextToken
}) {
  useEffect(() => {
    document.title = 'RightOn! | Game editor';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);
  const classes = useStyles();
  const history = useHistory();
  const [gameDetails, setGameDetails] = useState(() => {
    if (game) {
      return { ...game };
    }
    else {
      return newGame;
    }
  });

  const selectedQuestionTemplates = selectedQuestions.map(question => {
    return {questionTemplate: question, gameQuestionId: null }
  });
  // these two state variables will be updated by the user on this screen, and then sent to the API when they click "Save Game"
  const [localQuestionTemplates, setLocalQuestionTemplates] = useState([...gameDetails.questionTemplates]);

  const [phaseOne, setPhaseOne] = useState(() => {
    if (gameDetails.phaseOneTime === null) {
      return 180;
    }
    else {
      return gameDetails.phaseOneTime;
    }
  });
  const [phaseTwo, setPhaseTwo] = useState(() => {
    if (gameDetails.phaseTwoTime === null) {
      return 180;
    }
    else {
      return gameDetails.phaseTwoTime;
    }
  });

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
    setGameDetails({ ...gameDetails, grade: grade, domain: domain, cluster: cluster, standard: standard });
  }

  const handleDelete = (index) => {
    const newQuestions = [...localQuestionTemplates];
    newQuestions.splice(index, 1);
    setLocalQuestionTemplates(newQuestions);
  }

  const handleAdd = (questionTemplate) => {
    setLocalQuestionTemplates((prev) => [...prev, questionTemplate]);
    setQuestionTemplatesToAdd((prev) => [...prev, questionTemplate.id]);
  }

  // Handles any new questions added to the game, either through Add Question or Create Question
  const handleGameQuestion = (newQuestion) => {
    setDisabled(isButtonDisabled());
    for (let i = 0; i < questions.length; i++) {
      if (newQuestion.id === questions[i].id) {
        questions[i] = newQuestion
        return null;
      }
    }
    setQuestions([...questions, newQuestion])
  };

  // Handles if the Save Game button is disabled. The button become enabled when all required fields have values in it. The required fields/values are the game's title, description, and 4+ questions.
  const isButtonDisabled = () => {
    if (gameDetails.title.length > 0 && gameDetails.description.length > 0 && gameDetails.imageUrl.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  // Save New or Existing Game (preliminary submit)
  const handleSubmit = (event) => {
    console.log(localQuestionTemplates);
    gameDetails.questionTemplates = localQuestionTemplates;

    saveGameTemplate(game, gameDetails);
    setLocalQuestionTemplates([]);
    event.preventDefault();
    history.push('/');
  };

  const handleStringInput = (value) => {
    let newString = value.replace(/\'/g, '\u2019');
    return newString;
  }
  let content = (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container item xs={1} sm={2}></Grid>

          <Grid item container xs={10} sm={8} className={classes.page}>
            <Grid container item xs={12} className={classes.game}>
              <Grid container item xs={12}>
                <Typography style={{ fontWeight: 500, fontSize: '20px' }}>
                  Create Game
                </Typography>
              </Grid>

              <Grid container item xs={12}>
                <Typography style={{ fontWeight: 700, fontSize: '16px', color: '#FC1047', paddingBottom: '10px' }}>
                  Note: In order for this game to be playable in advanced mode, there must be a minimum of 5 questions.
                </Typography>
              </Grid>

              <Grid container item xs={12}>
                <Grid container item xs={12} sm={8}>
                  <Grid container item xs={12}>
                    <TextField
                      variant='outlined'
                      label='Game Title'
                      value={gameDetails.title}
                      onChange={({ currentTarget }) => { setGameDetails({ ...gameDetails, title: handleStringInput(currentTarget.value) }) }}
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
                      onChange={({ currentTarget }) => { setGameDetails({ ...gameDetails, description: handleStringInput(currentTarget.value) }) }}
                      fullWidth
                      multiline
                      rows={3}
                      className={classes.gameText}
                    />
                  </Grid>

                  <Grid container item xs={12} className={classes.thirdRow}>
                    <Grid container item xs={3} sm={2}>
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

                    <Grid container item xs={3} sm={2}>
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

                    <Grid container item xs={6} sm={8}>
                      <TextField
                        variant='outlined'
                        label='Image URL'
                        fullWidth
                        value={gameDetails.imageUrl}
                        onChange={({ currentTarget }) => { setGameDetails({ ...gameDetails, imageUrl: currentTarget.value }) }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container item xs={12} sm={4} justifyContent='center'>
                  {gameDetails.imageUrl ? <img src={gameDetails.imageUrl} alt="" width={'60%'} /> : <img src={RightOnPlaceHolder} alt="Placeholder" height={'275px'} />}
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
                <Typography style={{ fontWeight: 400, fontSize: '14px', color: '#A7A7A7' }}>
                  To add an exisiting question from another game into this one, click the Add Question button. To create a new question, click the Create Question button. Once you have added a question to the game, the question will appear in the space below.
                </Typography>
              </Grid>

              <Grid container item xs={12} className={classes.questionHolder}>
                {
                !isNullOrUndefined(localQuestionTemplates) 
                  ? 
                  localQuestionTemplates.map((questionData, index) => {
                    const question = questionData.questionTemplate;
                    return (
                      <Grid key={index} container item xs={12}>
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
                                    {question.title}
                                  </Typography>
                                </Grid>
                              </Grid>

                              <Grid container item xs={2}>
                                <Grid container item xs={10} justifyContent='center'>
                                  {question.imageUrl ? <img className={classes.image} src={question.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" height={'128px'} />}
                                </Grid>

                                <Grid container direction='column' item xs={2}>
                                  <Grid container item xs={2}>
                                    <IconButton size='small' onClick={() => handleDelete(index)}>
                                      <Cancel />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                : 
                null
                }

                <Grid container item xs={12} className={classes.questionAddition}>
                  <Grid container item xs={6} justifyContent='center'>
                    <Button variant='contained' disableElevation className={classes.blueButton} onClick={() => handleQuestionBankClick(gameDetails)}>
                      Question Bank
                    </Button>
                  </Grid>

                  <Grid container item xs={6} justifyContent='center'>
                    <Button variant='contained' disableElevation className={classes.greenButton} onClick={() => history.push(`/gamemaker/${gameDetails.id}/questionmaker/0`)}>
                      Create Question
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {questions.length > 0 ? <GameCCSS questions={questions} handleCCSS={handleCCSS} currentGameGrade={gameDetails.grade} /> : <Grid container item xs={12}></Grid>}

            <Grid container item xs={12} style={{display: 'flex', justifyContent: 'center', gap: 16}}>
              <Button variant='contained' type='submit' disableElevation className={classes.blueButton}>
                Save Game
              </Button>
              <Button variant='contained' disableElevation className={classes.greenButton} onClick={()=> { setSelectedQuestions([]); setLocalQuestionTemplates([]); history.push('/')}}>
                Cancel
              </Button>
            </Grid>
          </Grid>

          <Grid container item xs={1} sm={2}></Grid>
        </Grid>
      </form>
    </div>
  );
  return (
      <Switch>
        <Route exact path='/gamemaker/:gameId/questionmaker/:questionId' render={
          isUserAuth && (
            ({match}) => {
              const { questionId, gameId } = match.params;
              const question = getQuestionTemplateById(questions, questionId);
              return <QuestionMaker 
                question={question} 
                gameId={gameId} 
                handleCreateQuestionTemplate={handleCreateQuestionTemplate} 
                handleUpdateQuestionTemplate={handleUpdateQuestionTemplate}
                localQuestionTemplates={localQuestionTemplates}
                setLocalQuestionTemplates={setLocalQuestionTemplates}
              />
            }
          )
        } />
        <Route exact path="/gamemaker/:gameId/addquestion" render=
          {({ match }) => {
            const { gameId } = match.params;
            return (
              <>
                <Grid item xs={12} className={classes.contentGrid}>
                  <Box className={classes.actions}>
                    <SearchBar 
                      setSearchInput={setSearchInput} 
                      searchInput={searchInput} 
                      isSearchClick={isSearchClick} 
                      handleSearchClick={handleSearchClick} 
                      isResolutionMobile={isResolutionMobile} 
                      handleSearchChange={handleSearchChange}
                    />
                    <SortByDropdown 
                      isGames={location.pathname === "/"} 
                      listQuerySettings={listQuerySettings} 
                      handleUpdateListQuerySettings={handleUpdateListQuerySettings} 
                      sortByCheck={sortByCheck} 
                      setSortByCheck={setSortByCheck} 
                      isResolutionMobile={isResolutionMobile} 
                      style={{zIndex: 5}}
                    />
                  </Box>
                  <Box container onClick={() => setSortByCheck(false)}>
                  <QuestionDashboard gameId={gameId} loading={loading} questions={questions} isUserAuth={isUserAuth} handleScrollDown={handleScrollDown} nextToken={nextToken} handleQuestionSelected={handleQuestionSelected} gameDetails={gameDetails} setGameDetails={setGameDetails}/>   
                  </Box>
                </Grid>
                <Box className={classes.addQuestionFooter}>
                  <Button 
                    variant='contained' 
                    disableElevation 
                    className={classes.blueButton} 
                    onClick={(event) => {
                    setLocalQuestionTemplates([...localQuestionTemplates, ...selectedQuestionTemplates]);
                    history.push(`/gamemaker/${gameId}`)
                  }}>
                    Add to Game
                  </Button>
                </Box>
              </>
            );
          }} 
        />
        <Route path="/gamemaker/:gameId">
          {content}
        </Route>
      </Switch>
  );
}

const useStyles = makeStyles(theme => ({
  contentGrid: {
    padding: `0px 0px 0px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    overflowY: 'hidden',
    overflowX: 'hidden',
  },
  actions: {
    paddingTop: '10px',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 10px 0px  !important`,
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    height: '40px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex:3
  },
  addQuestionFooter: {
    width: '100%',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    background: '#FFF',
    zIndex: 4
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