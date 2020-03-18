import React, { useCallback, useEffect, useState } from 'react';
// import Amplify, { Auth } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Box from '@material-ui/core/Box';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Nav from './components/Nav';
import Games from './components/Games';
import QuestionForm from './components/QuestionForm';
// use local storage instead of mock
import gamesMock from './data/Games.json';
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);

// async function getInitialGamesFromDynamoDB(onSuccess, onError) {
//   try {
//     const apiName = 'GamesAPI';
//     const path = '/items';
//     const response = await API.get(apiName, path);
//     onSuccess(response);
//   } catch (exception) {
//     onError(exception);
//     console.log('Error getting initial Games from DynamoDB:', exception);
//   }
// }

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#307583',
    },
    secondary: {
      main: '#8e2e9d',
    },
  },
});

function App() {
  const [games, setGames] = useState(gamesMock);

  // useEffect(() => {
  //   getInitialGamesFromDynamoDB((data) => {
  //     debugger;
  //   }, (error) => {
  //     debugger;
  //     console.log(error);
  //   });
  // }, []);

  const saveGame = useCallback((game, gameIndex) => {
    const newGames = [...games];
    newGames[Number(gameIndex)] = game;
    setGames(newGames);
  }, [games, setGames]);

  const saveQuestion = useCallback((question, gameIndex, questionIndex) => {
    const newGames = [...games];
    const game = { ...games[Number(gameIndex)] };
    game[`q${Number(questionIndex)}`] = question;
    newGames[Number(gameIndex)] = game;
    setGames(newGames);
  }, [games, setGames]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box>
          <Nav />
          <Switch>
            <Route path="/games/:gameIndex/questions/:questionIndex" render={
              ({ match }) => {
                const { questionIndex, gameIndex } = match.params;
                return <QuestionForm saveQuestion={saveQuestion} question={games[Number(gameIndex) - 1][`q${Number(questionIndex)}`]} {...match.params} />;
              }
            } />
            <Route path="/">
              <Games games={games} saveGame={saveGame} />
            </Route>
          </Switch>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
