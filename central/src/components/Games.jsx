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
  handleDeleteGameQuestion,
  saveGameTemplate,
  listQuerySettings,
  handleUpdateListQuerySettings,
  handleSearchChange,
  sortByCheck,
  setSortByCheck,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameId');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
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
            <Switch>
              <Route exact path="/games/:gameId/questions/:questionIndex" render={
                ({ match }) => {
                  const { questionIndex, gameId } = match.params;
                  const game = getGameById(games, gameId);
                  handleSearchClick(false);
                  return <QuestionDetails backUrl={`/games/${gameId}`} gameTitle={game.title} questionIndex={questionIndex} question={game.questions[questionIndex]} />
                }
              } />
              <Route exact path="/games/:gameId" render={
                ({ match }) => {
                  const { gameId } = match.params;
                  const game = getGameById(games, gameId);
                  handleSearchClick(false);
                  return <GameLaunch loading={loading} saveGame={editGameTemplate} handleDeleteQuestionTemplate={handleDeleteQuestionTemplate} game={game} gameId={gameId} deleteGame={deleteGame} handleCloneGameTemplate={cloneGameTemplate} isUserAuth={isUserAuth} />;
                }
              } />
            </Switch>
          </Grid>
        )}
        <Route path='/gamemaker/:gameId' render={
          isUserAuth && (
            ({ match }) => {
              const { gameId } = match.params;
              const newGame = Number(gameId) === 0;
              handleSearchClick(false);
              return <GameMaker 
                loading={loading} 
                questions={questions} 
                game={newGame ? null : getGameById(games, gameId)} 
                createNewGameTemplate={createNewGameTemplate} 
                editGameTemplate={editGameTemplate} 
                gameId={gameId} 
                games={games} 
                cloneQuestion={cloneQuestion} 
                handleQuestionBankClick={handleQuestionBankClick} 
                handleDeleteGameQuestion={handleDeleteGameQuestion} 
                selectedQuestions={selectedQuestions} 
                setSelectedQuestions={setSelectedQuestions} 
                saveGameTemplate={saveGameTemplate}
                isUserAuth={isUserAuth}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                isSearchClick={isSearchClick}
                handleSearchClick={handleSearchClick}
                isResolutionMobile={isResolutionMobile} 
                listQuerySettings={listQuerySettings}
                handleUpdateListQuerySettings={handleUpdateListQuerySettings} 
                sortByCheck={sortByCheck}
                setSortByCheck={setSortByCheck}
                handleScrollDown={handleScrollDown}
                handleQuestionSelected={handleQuestionSelected} 
              />;
            }
          )
        } />
        <Route path='/questionmaker/:questionId' render={
          isUserAuth && (
            ({match}) => {
              const { questionId } = match.params;
              const question = getQuestionTemplateById(questions, questionId);
              handleSearchClick(false);
              return <QuestionMaker question={question} handleCreateQuestionTemplate={handleCreateQuestionTemplate} handleUpdateQuestionTemplate={handleUpdateQuestionTemplate}/>
            } 
          )
        }/>
        <Route path="/">
          <Grid item xs={12} className={classes.contentGrid}>
            <Box className={classes.actions}>
              <SearchBar isGames={location.pathname === "/"} handleSearchChange={handleSearchChange} searchInput={searchInput} isSearchClick={isSearchClick} handleSearchClick={handleSearchClick} isResolutionMobile={isResolutionMobile} />
              <SortByDropdown isGames={location.pathname === "/"} listQuerySettings={listQuerySettings} handleUpdateListQuerySettings={handleUpdateListQuerySettings} sortByCheck={sortByCheck} setSortByCheck={setSortByCheck} style={{zIndex: 5}}/>
            </Box>
            <Box onClick={() => setSortByCheck(false)}>
              <Route exact path="/questions" render= { () => 
                <QuestionDashboard loading={loading} questions={questions} isUserAuth={isUserAuth} handleScrollDown={handleScrollDown} nextToken={nextToken} handleDeleteQuestionTemplate={handleDeleteQuestionTemplate} handleCloneQuestionTemplate={handleCloneQuestionTemplate}/>   
              }/>
              <Route exact path="/" render= { () => 
                <GameDashboard id="GameDashboard" nextToken={nextToken} loading={loading} games={games} handleScrollDown={handleScrollDown} saveGame={editGameTemplate} deleteGame={deleteGame} cloneGameTemplate={cloneGameTemplate} isUserAuth={isUserAuth} />
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
    marginTop: 0,
    width: 'calc(100% + 16px) !important',
    zIndex: -2,
    overflowY: 'auto'
  },
  contentGrid: {
    padding: `0px 0px 0px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    overflowY: 'hidden',
    overflowX: 'hidden',
  },
  content: {
    backgroundColor: '#F2F2F2',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
