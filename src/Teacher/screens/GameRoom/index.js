import React from 'react';
import { screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import Portal from '../../../screens/Portal';
import GameRoomSettings from './GameRoomSettings';
import GameRoomStart from './GameRoomStart';
import GameRoomOverview from './GameRoomOverview';
import GameRoomPreview from './GameRoomPreview';
import GameRoomResults from './GameRoomResults';
import GameRoomFinal from './GameRoomFinal';
import GameRoomNewGame from './GameRoomNewGame';
import LocalStorage from '../../../../lib/Categories/LocalStorage';
import { deleteGameFromDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherGameRoomAPI';
import { updateTeacherHistoryInTeacherAccountInDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherAccountsAPI';
import debug from '../../../utils/debug';


export default class GameRoom extends React.Component {
  static propTypes = {
    screenProps: screenPropsPropTypes,
  }
  
  static defaultProps = {
    screenProps: screenPropsDefaultProps,
  }

  constructor(props) {
    super(props);
    this.state = {
      nextTeam: 'team0',
      portal: 'Creating Game..',      
      preview: null,
      renderType: 'portal',
      teams: [],
    };

    this.mounted = true;
  }


  componentDidMount() {
    setTimeout(() => this.mounted && this.setState({ portal: false, renderType: 'start' }), 2000);
  }


  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.screenProps.players).length !==
      Object.keys(nextProps.screenProps.players).length) {
      const teams = [];
      const playerValues = Object.values(nextProps.screenProps.players);
  
      for (let i = 0; i < playerValues.length; i += 1) {
        teams[playerValues[i]] = 
          teams[playerValues[i]] === undefined ? 1 : teams[playerValues[i]] + 1;
      }
      this.setState({ teams });
    }
  }

  
  componentWillUnmount() {
    this.mounted = false;
  }


  setNextTeam = () => {
    const { gameState } = this.props.screenProps;
    const { preview } = this.state;
    let nextTeamRef;
    const gameStateKeys = Object.keys(gameState);
    for (let i = 0; i < gameStateKeys.length; i += 1) {
      if (gameStateKeys[i].includes('team') && gameStateKeys[i] !== preview) {
        const teamRef = gameStateKeys[i];
        if (
          gameState[teamRef].tricks.length &&
          (gameState[teamRef].choices.length === 0 ||
            (gameState[teamRef].choices[0] && !gameState[teamRef].choices[0].votes &&
            gameState[teamRef].choices[1] && !gameState[teamRef].choices[1].votes &&
            gameState[teamRef].choices[2] && !gameState[teamRef].choices[2].votes &&
            gameState[teamRef].choices[3] && !gameState[teamRef].choices[3].votes)
          )
        ) {
          nextTeamRef = teamRef;
          break;
        }
        // Do a deeper check in case `handleGamePreview()` was operated on team
        let completed = false;
        for (let j = 0; j < gameState[teamRef].choices.length; j += 1) {
          if (gameState[teamRef].choices[j].votes) {
            completed = true;
            break;
          }
        }
        if (!completed) {
          nextTeamRef = teamRef;
          break;
        }
      }
    }
    if (nextTeamRef) {
      this.setState({ nextTeam: nextTeamRef });
    } else {
      this.setState({ nextTeam: '' });
    }
  }


  // Update all gameStates with a randomized order of choices for quizzing.
  handleGamePreview = (teamRef) => {
    const { gameState } = this.props.screenProps;
    // Create a random order of choices mixed with the correct answer.
    const { handleSetAppState, IOTPublishMessage } = this.props.screenProps;
    const updatedGameState = { ...gameState };
    
    const selectedTricks = gameState[teamRef].tricks.filter(trick => trick.selected) || [];
    debug.log('selectedTricks:', selectedTricks);
    
    // Automatically picks out the first tricks if none were selected
    // if (!selectedTricks.length && gameState[teamRef].tricks.length) {
    //   for (let i = 0;
    //     i < gameState[teamRef].tricks.length || selectedTricks.length !== 3;
    //     i += 1) {
    //     selectedTricks.push(gameState[teamRef].tricks[i]);
    //   }
    // }

    const dualUid = `${Math.random()}`;
    const choicesLimit = selectedTricks.length + 1;
    const choices = [];
    choices[choicesLimit - 1] = null;
    choices.fill(null, 0, choicesLimit - 1);
    // Map the correct answer to the index in the random ordered array.
    const correctIndex = Math.floor(Math.random() * choicesLimit);
    choices[correctIndex] =
      { correct: true, uid: dualUid, value: gameState[teamRef].answer, votes: 0 };

    let trickAnswerIndex = 0;
    while (choices.indexOf(null) > -1 &&
      trickAnswerIndex < choicesLimit - 1 &&
      selectedTricks[trickAnswerIndex]) {
      const randomIndex = Math.floor(Math.random() * choicesLimit);
      if (!choices[randomIndex]) {
        choices[randomIndex] = { uid: `${Math.random()}`, value: selectedTricks[trickAnswerIndex].value, votes: 0 };
        trickAnswerIndex += 1;
      }
      if (choices.indexOf(null) === choices.lastIndexOf(null)) {
        // Last spot left - plug in the remaining trick value.
        for (let i = 0; i < choicesLimit; i += 1) {
          if (choices[i] === null) {
            choices[i] = { uid: `${Math.random()}`, value: selectedTricks[trickAnswerIndex].value, votes: 0 };
            trickAnswerIndex += 1;
          }
        }
      }
    }

    debug.log(`Choices for ${teamRef}:`, JSON.stringify(choices));

    const time = Date.now();
    
    const message = {
      action: 'SET_TEAM_CHOICES',
      teamRef,
      uid: dualUid,
      payload: choices,
      state: typeof teamRef === 'string' ? { startQuiz: true, teamRef, time } : null, 
    };
    IOTPublishMessage(message);
    
    updatedGameState[teamRef].choices = choices;
    if (teamRef) {
      // This is a specific handler for handleStartRandomGame() due to it not 
      // setting state of gameState by default when calling handleGamePreview()
      // causing the "Start quiz" label to show in GameRoomPreview.
      updatedGameState.state = { startQuiz: true, teamRef };
    }
    handleSetAppState('gameState', updatedGameState);

    this.setState({ renderType: 'preview', preview: teamRef }, () => this.setNextTeam());
  }


  handleStartGame = () => {
    const message = {
      action: 'START_GAME',
      uid: `${Math.random()}`,
      payload: { start: true },
    };
    this.props.screenProps.IOTPublishMessage(message);
    // if (__DEV__) {
    this.setState({ portal: 'RightOn!', renderType: 'portal' });
    setTimeout(() => this.mounted && this.setState({ portal: false, renderType: 'overview' }), 1500);
    //   return;
    // }
    // setTimeout(() => this.mounted && this.setState({ portal: '5', renderType: 'portal' }), 256);
    // setTimeout(() => this.mounted && this.setState({ portal: '4' }), 1000);
    // setTimeout(() => this.mounted && this.setState({ portal: '3' }), 2000);
    // setTimeout(() => this.mounted && this.setState({ portal: '2' }), 3000);
    // setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
    // setTimeout(() => this.mounted && this.setState({ portal: 'RightOn!' }), 5000);
    // setTimeout(() => this.mounted && 
    //   this.setState({ portal: false, renderType: 'overview' }), 5500);
    this.removeQuestionsWithMissingPlayers();
  }


  removeQuestionsWithMissingPlayers = () => {
    const { teams } = this.state;
    const { gameState, handleSetAppState } = this.props.screenProps;
    const updatedGameState = { ...gameState };
    const gameStateKeys = Object.keys(updatedGameState);
    let deleted;
    for (let i = 0; i < gameStateKeys.length; i += 1) {
      if (gameStateKeys[i].includes('team')) {
        const index = gameStateKeys[i].substr(gameStateKeys[i].indexOf('m') + 1);
        if (!teams[index]) {
          deleted = true;
          delete updatedGameState[`team${index}`];
        }
      }
    }
    if (deleted) {
      handleSetAppState('gameState', updatedGameState);
    }
  }


  handleBackFromChild = (screen) => {
    if (screen) {
      this.setState({ renderType: screen, preview: null });
      return;
    }
    this.setState({ renderType: 'overview', preview: null });
  }


  handleStartQuiz = (teamRef) => {
    const { IOTPublishMessage } = this.props.screenProps;
    const message = {
      action: 'START_QUIZ',
      uid: `${Math.random()}`,
      payload: {
        startQuiz: true,
        teamRef,
      },
    };
    IOTPublishMessage(message);

    const { gameState, handleSetAppState } = this.props.screenProps;
    const updatedGameState = { ...gameState, state: { startQuiz: true, teamRef } };
    handleSetAppState('gameState', updatedGameState);
  }

  
  handleRenderNewGame = () => {
    this.setState({ renderType: 'newGame', preview: null });
  }


  handleStartRandomGame = () => {
    const { gameState } = this.props.screenProps;
    const gameStateKeys = Object.keys(gameState);
    for (let i = 0; i < gameStateKeys.length; i += 1) {
      if (gameStateKeys[i].includes('team')) {
        const teamRef = gameStateKeys[i];
        if (gameState[teamRef].choices.length === 0) {
          this.handleGamePreview(teamRef);
          return;
        }
        // Do a deeper check in case `handleGamePreview()` was operated on team
        let completed = false;
        for (let j = 0; j < gameState[teamRef].choices.length; j += 1) {
          if (gameState[teamRef].choices[j].votes) {
            completed = true;
            break;
          }
        }
        if (!completed) {
          this.handleGamePreview(teamRef);
          return;
        }
      }
    }
    // TODO Notify teacher that all quizzes have been completed.
  }


  handleViewResults = (teamRef) => {
    const { IOTPublishMessage } = this.props.screenProps;
    const message = {
      action: 'END_QUIZ',
      uid: `${Math.random()}`,
      payload: {
        endQuiz: true,
        teamRef,
      },
    };
    IOTPublishMessage(message);

    this.setState({ renderType: 'results', preview: teamRef });
  }


  handleNextTeam = () => {
    const { nextTeam } = this.state;
    if (nextTeam) {
      this.handleGamePreview(nextTeam);
    } else {
      this.setState({ renderType: 'final', preview: '' }, () => {
        this.handleEndMessage();
        debug.log('End of game! Updating teacher account and history!');
        setTimeout(() => {
          const {
            account,
            handleSetAppState,
            gameState,
            players,
          } = this.props.screenProps;
          this.updateTeacherAccountAndHistory(
            account,
            handleSetAppState,
            gameState,
            Object.keys(players).length,
          );
        }, 1500);
      });
    }
  }


  handleEndMessage = () => {
    const {
      IOTPublishMessage,
      players,
    } = this.props.screenProps;
    const message = {
      action: 'END_GAME',
      uid: `${Math.random()}`,
      players,
    };
    IOTPublishMessage(message);
  }
  
  
  handleEndGame = () => {
    this.props.screenProps.navigation.navigate('Games');
    this.handleExitMessage();
    setTimeout(() => {
      const {
        handleSetAppState,
        IOTUnsubscribeFromTopic,
      } = this.props.screenProps;
      const { GameRoomID } = this.props.screenProps;
      IOTUnsubscribeFromTopic();
      handleSetAppState('gameState', {});
      handleSetAppState('GameRoomID', '');
      handleSetAppState('players', {});
      deleteGameFromDynamoDB(GameRoomID,
        () => debug.log('Deleted GameRoomID from DynamoDB'),
        e => debug.warn('Error deleting GameRoomID from DynamoDB', JSON.stringify(e))
      );
    }, 0);
  }


  handleExitMessage = () => {
    const { IOTPublishMessage } = this.props.screenProps;
    const message = {
      action: 'EXIT_GAME',
      uid: `${Math.random()}`,
    };
    IOTPublishMessage(message);
  }


  updateTeacherAccountAndHistory = async (
    account,
    handleSetAppState,
    gameState,
    numberOfPlayers,
  ) => {
    const update = {
      historyRef: {
        local: account.historyRef.local + 1,
        db: account.historyRef.db,
      },
      gamesPlayed: account.gamesPlayed + 1,
    };
    handleSetAppState('account', update);


    const teacherHistoryJSON = await LocalStorage.getItem(`@RightOn:${account.TeacherID}/History`);
    const teacherHistory = JSON.parse(teacherHistoryJSON);
    const report = this.generateHistoryReport(gameState, numberOfPlayers);
    teacherHistory.unshift(report);
    const updatedTeacherHistoryJSON = JSON.stringify(teacherHistory);
    LocalStorage.setItem(`@RightOn:${account.TeacherID}/History`, updatedTeacherHistoryJSON);
    
    const TeacherID = account.TeacherID;
    updateTeacherHistoryInTeacherAccountInDynamoDB(
      TeacherID,
      teacherHistory,
      (res) => {
        handleSetAppState('account', {
          history: {
            local: update.history.local,
            db: update.history.db + 1,
          }
        });
        debug.log('Successfully UPDATED teacher history in DynamoDB:', JSON.stringify(res));
      },
      exception => debug.warn('Error UPDATING teacher history in DynamoDB in updateTeacherAccountAndHistory():', JSON.stringify(exception)),
    );
  }


  generateHistoryReport = (gameState, players) => {
    const date = Date.now();
    const GameID = gameState.GameID;
    const favorite = gameState.favorite;
    const report = {
      date,
      GameID,
      favorite,
      players,
      uid: `${Math.random()}`,
    };
    
    const gameStateKeys = Object.keys(gameState);
    for (let i = 0; i < gameStateKeys.length; i += 1) {
      if (gameStateKeys[i].includes('team')) {
        let correct = 0;
        let incorrect = 0;
        let tricks = 0;

        const choices = gameState[gameStateKeys[i]].choices || [];
        for (let j = 0; j < choices.length; j += 1) {
          if (choices[j].correct) {
            correct += choices[j].votes;
          } else {
            incorrect += choices[j].votes;
          }
        }
        tricks += gameState[gameStateKeys[i]].tricks.length;
        report[gameStateKeys[i]] = {
          correct,
          incorrect,
          tricks,
          question: gameState[gameStateKeys[i]].question,
          image: gameState[gameStateKeys[i]].image,
          choices: gameState[gameStateKeys[i]].choices,
          uid: gameState[gameStateKeys[i]].uid,
        };
      }
    }
    return report;
  }


  render() {
    const {
      GameRoomID,
      gameState,
      handleSetAppState,
      IOTPublishMessage,
      players,
    } = this.props.screenProps;
    const {
      nextTeam,
      renderType,
      portal,
      preview,
      teams,
    } = this.state;

    switch (renderType) {
      case 'portal':
        return (
          <Portal
            messageType={'single'}
            messageValues={{
              message: portal,
            }}
          />
        );
      case 'settings':
        return (
          <GameRoomSettings
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleSetAppState={handleSetAppState}
            IOTPublishMessage={IOTPublishMessage}
            numberOfPlayers={Object.keys(players).length}
          />
        );
      case 'start':
        return (
          <GameRoomStart
            GameRoomID={GameRoomID}
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleEndGame={this.handleEndGame}
            handleStartGame={this.handleStartGame}
            players={players}
            teams={teams}
          />
        );
      case 'overview':
        return (
          <GameRoomOverview
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleEndGame={this.handleEndGame}
            handleGamePreview={this.handleGamePreview}
            handleRenderNewGame={this.handleRenderNewGame}          
            handleStartRandomGame={this.handleStartRandomGame}
            nextTeam={nextTeam}
            players={players}
            teams={teams}
          />
        );
      case 'preview':
        return (
          <GameRoomPreview
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleViewResults={this.handleViewResults}
            handleStartQuiz={this.handleStartQuiz}
            teamRef={preview}
          />
        );
      case 'results':
        return (
          <GameRoomResults
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleNextTeam={this.handleNextTeam}
            handleViewResults={this.handleViewResults}
            handleStartQuiz={this.handleStartQuiz}
            nextTeam={nextTeam}
            players={players}
            numberOfPlayers={Object.keys(players).length}
            teamRef={preview}
          />
        );
      case 'final':
        return (
          <GameRoomFinal
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleEndGame={this.handleEndGame}
            handleRenderNewGame={this.handleRenderNewGame}
            numberOfPlayers={Object.keys(players).length}
            players={players}
          />
        );
      case 'newGame':
        return (
          <GameRoomNewGame
            GameRoomID={GameRoomID}
            gameState={gameState}
            handleBackFromChild={this.handleBackFromChild}
            handleSetAppState={handleSetAppState}
            IOTPublishMessage={IOTPublishMessage}
            TeacherID={this.props.screenProps.account.TeacherID}
          />
        );
      default:
        return null;
    }
  }
}
