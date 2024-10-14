import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Button } from '@material-ui/core';
import GameLaunch from './GameLaunch';
import GameDashboard from './GameDashboard';
import SortByDropdown from './SortByDropdown';
import QuestionDetails from './QuestionDetail';
import QuestionDashboard from './QuestionDashboard';
import QuestionMaker from './QuestionMaker';
import GameMaker from './GameMaker';
import { getGameById, getQuestionTemplateById } from '../lib/HelperFunctions';
import SearchBar from './SearchBar.jsx';

export default function Games({ 
  loading,
  nextToken,  
  games, 
  questions, 
  editGameTemplate, 
  handleDeleteQuestionTemplate, 
  handleScrollDown, 
  createNewGameTemplate, 
  deleteGame, 
  cloneGameTemplate, 
  handleCreateQuestionTemplate, 
  handleUpdateQuestionTemplate, 
  handleCloneQuestionTemplate,
  cloneQuestion, 
  isUserAuth, 
  setSearchInput, 
  searchInput, 
  isSearchClick, 
  handleSearchClick, 
  isResolutionMobile, 
  handleQuestionBankClick,
  handleCreateQuestionTemplateClick,
  handleDeleteGameQuestion,
  saveGameTemplate,
  listQuerySettings,
  handleUpdateListQuerySettings,
  handleSearchChange,
  sortByCheck,
  setSortByCheck,
  publicPrivateQueryType,
  handlePublicPrivateChange,
  checkGameOwner,
  checkQuestionOwner
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
  let gameId;
  if (match && !getGameById(games, match.params.gameId)) {
    gameId  = match.params.gameId;
  }


  const questionMatch = useRouteMatch('/games/:gameId/questions/:questionId');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const game = getGameById(games, gameId) ?? null;
  console.log(game);
    // New "empty" game
    const newGame = {
      title: '',
      description: '',
      grade: '',
      domain: '',
      phaseOneTime: 180,
      phaseTwoTime: 180,
      imageUrl: '',
      questionTemplates: [],
    }
  
    const [gameDetails, setGameDetails] = useState(() => {
      console.log(game);
      if (game) {
        return { ...game };
      }
      else {
        return {id: gameId, ...newGame};
      }
    });

  const [question, setQuestion] = useState((prev) => {
    if (prev) {
      const copyOfOriginal = { ...prev }
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
  // these two state variables will be updated by the user on this screen, and then sent to the API when they click "Save Game"
  const [localQuestionTemplates, setLocalQuestionTemplates] = useState(game ? [...game.questionTemplates] : []);
  console.log(localQuestionTemplates);
  const handleQuestionSelected = (question, isSelected) => {
    if (isSelected) {
      if (!selectedQuestions.some(existingQuestion => existingQuestion.id === question.id)) 
        setSelectedQuestions([...selectedQuestions, question]);
    } else {
      setSelectedQuestions(selectedQuestions.filter((existingQuestion) => existingQuestion.id !== question.id));
    }
  }
  return (
    <Grid container className={classes.root} spacing={4}>
      <Switch>
        {match && getGameById(games, match.params.gameId) && (
          <Grid item xs={12} className={classes.content}>
              <Route exact path="/games/:gameId/questions/:questionId" render={
                ({ match }) => {
                  const { gameId } = match.params;
                  const { questionId } = questionMatch.params;
                  const game = getGameById(games, gameId);
                  const questions = game.questionTemplates.map(({ questionTemplate }) => questionTemplate);
                  const question = getQuestionTemplateById(questions, questionId);
                  handleSearchClick(false);
                  return <QuestionDetails backUrl={`/games/${gameId}`} gameTitle={game.title} question={question} />
                }
              } />
              <Route exact path="/games/:gameId" render={
                ({ match }) => {
                  const { gameId } = match.params;
                  const game = getGameById(games, gameId);
                  handleSearchClick(false);
                  return <GameLaunch publicPrivateQueryType={publicPrivateQueryType} loading={loading} saveGame={editGameTemplate} handleDeleteQuestionTemplate={handleDeleteQuestionTemplate} handleDeleteGameQuestion={handleDeleteGameQuestion} game={game} gameId={gameId} deleteGame={deleteGame} handleCloneGameTemplate={cloneGameTemplate} isUserAuth={isUserAuth} />;
                }
              } />
          </Grid>
        )}
         {isUserAuth &&
          <Route path='/gamemaker/:gameId/questionmaker/:questionId' render={
            ({match}) => {
              if (!isUserAuth) {
                return null;
              }
              const { gameId, questionId } = match.params;
              const game = getGameById(games, gameId);
              let questions = null;
              if (game && game.questionTemplates.length > 0){
                questions = game.questionTemplates.map(({ questionTemplate }) => questionTemplate) ?? null;
                const checkForQuestion = getQuestionTemplateById(questions, questionId);
                if (checkForQuestion) {
                  setQuestion(checkForQuestion);
                };
              }
              handleSearchClick(false);
              return <QuestionMaker gameId={gameId} originalQuestion={question} localQuestionTemplates={localQuestionTemplates} setLocalQuestionTemplates={setLocalQuestionTemplates} handleCreateQuestionTemplate={handleCreateQuestionTemplate} handleUpdateQuestionTemplate={handleUpdateQuestionTemplate} publicPrivateQueryType={publicPrivateQueryType} handlePublicPrivateChange={handlePublicPrivateChange} question={question} setQuestion={setQuestion}/>
            } 
          }/>
        }
        {isUserAuth &&
         <Route path='/gamemaker/:gameId' render={
            ({ match }) => {
              if (!isUserAuth) {
                return null;
              }
              const { gameId } = match.params;
              const game = getGameById(games, gameId);
              gameDetails.id = gameId;
              if (game && game.questionTemplates.length > 0){
                setLocalQuestionTemplates(game.questionTemplates);
              }
              handleSearchClick(false);
              return <GameMaker 
                loading={loading} 
                questions={questions} 
                gameDetails={gameDetails} 
                setGameDetails={setGameDetails}
                createNewGameTemplate={createNewGameTemplate} 
                editGameTemplate={editGameTemplate} 
                gameId={gameId} 
                game={game}
                games={games} 
                cloneQuestion={cloneQuestion} 
                handleQuestionBankClick={handleQuestionBankClick} 
                handleCreateQuestionTemplateClick={handleCreateQuestionTemplateClick}
                handleCreateQuestionTemplate={handleCreateQuestionTemplate}
                handleDeleteGameQuestion={handleDeleteGameQuestion} 
                selectedQuestions={selectedQuestions} 
                setSelectedQuestions={setSelectedQuestions} 
                saveGameTemplate={saveGameTemplate}
                isUserAuth={isUserAuth}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                isSearchClick={isSearchClick}
                handleSearchClick={handleSearchClick}
                handleSearchChange={handleSearchChange}
                isResolutionMobile={isResolutionMobile} 
                listQuerySettings={listQuerySettings}
                handleUpdateListQuerySettings={handleUpdateListQuerySettings} 
                sortByCheck={sortByCheck}
                setSortByCheck={setSortByCheck}
                handleScrollDown={handleScrollDown}
                handleQuestionSelected={handleQuestionSelected} 
                nextToken={nextToken}
                localQuestionTemplates={localQuestionTemplates}
                setLocalQuestionTemplates={setLocalQuestionTemplates}
                publicPrivateQueryType={publicPrivateQueryType}
                handlePublicPrivateChange={handlePublicPrivateChange}
              />;
            }
        } />
        }
        <Route path='/questionmaker/:questionId' render={
            ({match}) => {
              if (!isUserAuth) {
                return null;
              }
              const { questionId } = match.params;
              const checkForQuestion = getQuestionTemplateById(questions, questionId);
              if (checkForQuestion) {
                try{
                  checkForQuestion.instructions = JSON.parse(checkForQuestion.instructions);
                  checkForQuestion.choices = JSON.parse(checkForQuestion.choices);
                  checkForQuestion.answerSettings = JSON.parse(checkForQuestion.answerSettings);
                } catch (e) {
                  console.log(e);
                }
                setQuestion(checkForQuestion);
              };
              handleSearchClick(false);
              return <QuestionMaker gameId={null} originalQuestion={question} localQuestionTemplates={localQuestionTemplates} setLocalQuestionTemplates={setLocalQuestionTemplates} handleCreateQuestionTemplate={handleCreateQuestionTemplate} handleUpdateQuestionTemplate={handleUpdateQuestionTemplate} listQuerySettings={listQuerySettings} handleUpdateListQuerySettings={handleUpdateListQuerySettings} publicPrivateQueryType={publicPrivateQueryType} handlePublicPrivateChange={handlePublicPrivateChange} question={question} setQuestion={setQuestion}/>
            } 
        }/>
        <Route path="/">
          <Grid item xs={12} className={classes.contentGrid}>
            <Box className={classes.actions}>
              <SearchBar isGames={location.pathname === "/"} handleSearchChange={handleSearchChange} searchInput={searchInput} isSearchClick={isSearchClick} handleSearchClick={handleSearchClick} isResolutionMobile={isResolutionMobile} />
              <SortByDropdown isGames={location.pathname === "/"} listQuerySettings={listQuerySettings} handleUpdateListQuerySettings={handleUpdateListQuerySettings} sortByCheck={sortByCheck} setSortByCheck={setSortByCheck} style={{zIndex: 5}} isUserAuth={isUserAuth} publicPrivateQueryType={publicPrivateQueryType} handlePublicPrivateChange={handlePublicPrivateChange}/>
            </Box>
            <Box onClick={() => setSortByCheck(false)}>
              <Route exact path="/questions" render= { () => 
                <QuestionDashboard loading={loading} questions={questions} isUserAuth={isUserAuth} handleScrollDown={handleScrollDown} nextToken={nextToken} handleDeleteQuestionTemplate={handleDeleteQuestionTemplate} handleCloneQuestionTemplate={handleCloneQuestionTemplate} checkQuestionOwner={checkQuestionOwner} publicPrivateQueryType={publicPrivateQueryType} />   
              }/>
              <Route exact path="/" render= { () => 
                <GameDashboard id="GameDashboard" checkGameOwner={checkGameOwner} nextToken={nextToken} publicPrivateQueryType={publicPrivateQueryType} loading={loading} games={games} handleScrollDown={handleScrollDown} saveGame={editGameTemplate} deleteGame={deleteGame} cloneGameTemplate={cloneGameTemplate} isUserAuth={isUserAuth} setGameDetails={setGameDetails}/>
              }/>
            </Box>
          </Grid>
        </Route>
      </Switch>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
    overflowX: 'hidden',
    overflowY: 'auto',
    zIndex: 0,
  },
  contentGrid: {
    padding: `0px 0px 0px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    overflowY: 'hidden',
    overflowX: 'hidden',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
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
  blueButton: {
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%);',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '17px',
    fontWeight: 500,
    color: 'white',
  },
}));
