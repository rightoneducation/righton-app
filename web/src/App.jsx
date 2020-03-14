import React, { useCallback, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Box from '@material-ui/core/Box';
import Nav from './components/Nav';
import Games from './components/Games';
import QuestionForm from './components/QuestionForm';
import './App.css';
// use local storage instead of mock
import gamesMock from './data/Games.json';

function App() {
  const [games, setGames] = useState(gamesMock);
  const addGame = useCallback((newGame) => {
    setGames([newGame, ...games]);
  }, [games, setGames]);

  const saveQuestion = useCallback((question, gameIndex, questionIndex) => {
    const newGames = [...games];
    const game = { ...games[gameIndex] };
    game[`q${questionIndex + 1}`] = question;
    newGames[gameIndex] = game;
    setGames(newGames);
  }, [games, setGames]);

  return (
    <Router>
      <Box>
        <Nav />
        <Switch>
          <Route path="/games/:gameIndex/questions/:questionIndex" render={
            ({ match }) => {
              const { questionIndex, gameIndex } = match.params;
              return <QuestionForm saveQuestion={saveQuestion} question={games[Number(gameIndex)][`q${Number(questionIndex) + 1}`]} {...match.params} />;
            }
          } />
          <Route path="/">
            <Games games={games} addGame={addGame} />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}

export default App;
