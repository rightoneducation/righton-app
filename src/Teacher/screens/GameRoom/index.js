import React from 'react';
// import {
//   // Image,
//   ScrollView,
//   // StatusBar,
//   Text,
//   View,
// } from 'react-native';
import PropTypes from 'prop-types';
// import Swiper from 'react-native-swiper';
import Portal from '../../../screens/Portal';
// import ButtonBack from '../../../components/ButtonBack';
import GameRoomStart from './GameRoomStart';
import GameRoomOverview from './GameRoomOverview';
import GameRoomPreview from './GameRoomPreview';
import GameRoomResults from './GameRoomResults';
// import LocalStorage from '../../../../lib/Categories/LocalStorage';
// import { colors, deviceWidth, fonts } from '../../../utils/theme';
// import styles from './styles';
import debug from '../../../utils/debug';


export default class GameRoom extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({}),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        state: PropTypes.shape({
          params: PropTypes.shape({}),
        }),
      }),
      players: PropTypes.shape({}),
    }),
  }
  
  static defaultProps = {
    screenProps: {
      gameState: {},
      handleSetAppState: () => {},
      IOTPublishMessage: () => {},
      navigation: {
        navigate: () => {},
        state: {
          params: {},
        },
      },
      players: {},
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      portal: `Joining ${props.screenProps.navigation.state.params.GameRoomID}`,
      preview: null,
      renderType: 'portal',
      teams: [],
    };

    this.mounted = true;

    this.handleBackFromChild = this.handleBackFromChild.bind(this);
    this.handleGamePreview = this.handleGamePreview.bind(this);
    this.handleViewResults = this.handleViewResults.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handleStartQuiz = this.handleStartQuiz.bind(this);    
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


  handleStartGame() {
    const message = {
      action: 'START_GAME',
      uid: `${Math.random()}`,
      payload: { start: true },
    };
    this.props.screenProps.IOTPublishMessage(message);
    setTimeout(() => this.mounted && this.setState({ portal: '5', renderType: 'portal' }), 256);
    setTimeout(() => this.mounted && this.setState({ portal: '4' }), 1000);
    setTimeout(() => this.mounted && this.setState({ portal: '3' }), 2000);
    setTimeout(() => this.mounted && this.setState({ portal: '2' }), 3000);
    setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
    setTimeout(() => this.mounted && this.setState({ portal: 'RightOn!' }), 5000);
    setTimeout(() => this.mounted && this.setState({ portal: false, renderType: 'overview' }), 5500);
  }


  // Update all gameStates with a randomized order of choices for quizzing.
  handleGamePreview(teamRef) {
    const { gameState } = this.props.screenProps;
    if (gameState[teamRef].choices.length === 0) {
      // Create a random order of choices mixed with the correct answer.
      // Map the correct answer to the index in the random ordered array.
      const { handleSetAppState, IOTPublishMessage } = this.props.screenProps;
      const updatedGameState = { ...gameState };
      const choices = [];
      const choicesLimit = gameState[teamRef].tricks.length + 1;
      const correctIndex = Math.floor(Math.random() * choicesLimit);
      choices[correctIndex] = { correct: true, value: gameState[teamRef].answer, votes: 0 };

      let trickAnswerIndex = 0;
      while (choices.length < choicesLimit && trickAnswerIndex < choicesLimit - 1) {
        const randomIndex = Math.floor(Math.random() * choicesLimit);
        if (!choices[randomIndex]) {
          choices[randomIndex] = { value: gameState[teamRef].tricks[trickAnswerIndex], votes: 0 };
          trickAnswerIndex += 1;
        }
        if (choices.length === choicesLimit - 1) {
          // Last spot left - plug in the remaining trick value.
          for (let i = 0; i < choicesLimit; i += 1) {
            if (choices[i] === undefined) {
              choices[i] = { value: gameState[teamRef].tricks[trickAnswerIndex], votes: 0 };
              trickAnswerIndex += 1;
            }
          }
        }
      }

      debug.log(`Choices for ${teamRef}:`, choices);

      updatedGameState[teamRef].choices = choices;
      handleSetAppState('gameState', updatedGameState);
      
      const message = {
        action: 'UPDATE_TEAM_CHOICES',
        teamRef,
        uid: `${Math.random()}`,
        payload: choices,
      };
      IOTPublishMessage(message);
    }
    this.setState({ renderType: 'preview', preview: teamRef });
  }


  handleBackFromChild() {
    this.setState({ renderType: 'overview', preview: null });
  }


  handleStartQuiz(teamRef) {
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
    const updatedGameState = { ...gameState, state: { startQuiz: teamRef } };
    handleSetAppState('gameState', updatedGameState);
  }


  handleViewResults(teamRef) {
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

    this.setState({ renderType: 'results' });
  }


  render() {
    const { gameState, players } = this.props.screenProps;
    const {
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
      case 'start':
        return (
          <GameRoomStart
            gameState={gameState}
            handleStartGame={this.handleStartGame}
            players={players}
            teams={teams}
          />
        );
      case 'overview':
        return (
          <GameRoomOverview
            gameState={gameState}
            handleGamePreview={this.handleGamePreview}
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
            handleViewResults={this.handleViewResults}
            handleStartQuiz={this.handleStartQuiz}
            teamRef={preview}
          />
        );
      default:
        return null;
    }
  }
}
