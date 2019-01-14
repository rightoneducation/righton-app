import Buffer from 'buffer';

global.Buffer = global.Buffer || Buffer.Buffer; // Required for aws sigv4 signing

import React from 'react';
import { AppState, YellowBox } from 'react-native';
import PropTypes from 'prop-types';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import { attachIotPolicy, IOTSubscribeToTopic, unsubscribeFromTopic, publishMessage } from './lib/Categories/IoT';
import studentMessageHandler from './lib/Categories/IoT/studentMessageHandler';
import teacherMessageHandler from './lib/Categories/IoT/teacherMessageHandler';

import { deleteGameFromDynamoDB } from './lib/Categories/DynamoDB/TeacherAPI';

import RootNavigator from './src/Navigator';

import LocalStorage from './lib/Categories/LocalStorage';
import debug from './src/utils/debug';

YellowBox.ignoreWarnings([]);
YellowBox.ignoreWarnings(
  [
    'Module RNFetchBlob requires main queue setup',
    'Require cycle:',
  ]
);


Amplify.configure(awsconfig);


export default class App extends React.Component {
  static propTypes = {
    onSignIn: PropTypes.func,
    onSignUp: PropTypes.func,
    doSignOut: PropTypes.func,
  }

  static defaultProps = {
    onSignIn: () => {},
    onSignUp: () => {},
    doSignOut: () => {},
  }

  constructor(props) {
    super(props);

    this.messagesReceived = {};
    this.requestAttempts = 0;

    this.state = {
      appState: AppState.currentState,
      gameState: {},
      gameroom: '',
      players: {},
      points: 0,
      ready: false,
      role: '', // 'Teacher' | 'Student'
      session: null,
      team: null,
    };

    this.handleOnSignIn = this.handleOnSignIn.bind(this);
    // this.handleOnSignUp = this.handleOnSignUp.bind(this);
    this.handleOnSignOut = this.handleOnSignOut.bind(this);
    this.handleSetAppState = this.handleSetAppState.bind(this);
    this.handleSetRole = this.handleSetRole.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);

    this.IOTSubscribeToTopic = this.IOTSubscribeToTopic.bind(this);
    this.IOTUnsubscribeFromTopic = this.IOTUnsubscribeFromTopic.bind(this);
    this.IOTPublishMessage = this.IOTPublishMessage.bind(this);
  }


  async componentDidMount() {
    await LocalStorage.init();
    let session;
    try {
      session = await Auth.currentSession();
    } catch (err) {
      debug.log(err);
      session = null;
    }
    this.setSession(session, () => {
      attachIotPolicy();
    });

    AppState.addEventListener('change', this.handleAppStateChange);
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.appState !== nextState.appState) return false;
    return true;
  }


  componentWillUnmount() {
    // TODO Unsubscribe from topic manually when game ends or user leaves game w/o exiting app.
    this.IOTUnsubscribeFromTopic();

    const { role } = this.state;
    if (role === 'Teacher') {
      const { GameRoomID } = this.state.gameState;
      if (GameRoomID) {
        deleteGameFromDynamoDB(GameRoomID,
          r => debug.log('Deleted GameRoom from DynamoDB', r),
          e => debug.log('Error deleting GameRoom from DynamoDB', e)
        );
      }
    }

    AppState.removeEventListener('change', this.handleAppStateChange);
  }


  setSession(session) {
    this.setState({
      session,
      ready: true,
    });
  }


  handleAppStateChange(nextAppState) {
    const { appState, gameroom } = this.state;
    if (gameroom) {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        debug.log('App has come to the foreground - resubscribing to GameRoom:', gameroom);
        this.IOTSubscribeToTopic(gameroom);
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        debug.log('App going into background - unsubscribing from GameRoom:', gameroom);
        this.IOTUnsubscribeFromTopic(gameroom);
      }
    }
    this.setState({ appState: nextAppState });
  }


  handleOnSignIn(session) {
    this.setState({ session });
  }

  // handleOnSignUp = () => { }


  handleOnSignOut() {
    Auth.signOut();
    this.setState({ session: null });
  }


  handleSetRole(role) {
    this.setState({ role });
  }


  handleSetAppState(property, value) {
    switch (property) {
      case 'gameroom':
        this.setState({ gameroom: value });
        break;
      case 'gameState':
        this.setState({ gameState: value });
        break;
      case 'team':
        this.setState({ team: value });
        break;
      case 'players':
        this.setState({ players: value });
        break;
      case 'points':
        this.setState({ points: this.state.points + value });
        break;   
      default:
        break;
    }
  }


  IOTSubscribeToTopic(topic) {
    const { role } = this.state;
    IOTSubscribeToTopic(topic, role === 'Teacher' ? teacherMessageHandler : studentMessageHandler, this);
    if (role !== 'Teacher') {
      const requestMessage = {
        action: 'REQUEST_GAME_STATE',
        uid: `${Math.random()}`,
      };
      // Throttle the publishMessage() so PubSub is given time to connect to the GameRoom first.
      setTimeout(() => publishMessage(topic, requestMessage), 1000);
    }
    debug.log('Subscribed to GameRoom:', topic);
  }


  IOTUnsubscribeFromTopic(specifiedGameroom) {
    if (specifiedGameroom) {
      unsubscribeFromTopic(specifiedGameroom);
    } else {
      const { gameroom } = this.state;
      unsubscribeFromTopic(gameroom);
    }
  }


  IOTPublishMessage(message) {
    const { gameroom, gameState } = this.state;
    const GameRoomID = gameState.GameRoomID || gameroom || '';
    if (!GameRoomID) {
      debug.warn('Attempted to publish message w/o a GameRoomID set. Message:', JSON.stringify(message));
      return;
    }
    // Prevent computing received messages sent by self.
    this.messagesReceived[message.uid] = true;
    publishMessage(GameRoomID, message);
  }


  render() {
    const { 
      gameroom,
      gameState,
      players,
      points,
      // ready,
      session,
      team,
    } = this.state;

    const {
      onSignIn,
      onSignUp,
      doSignOut,
    } = this.props;

    return (
      <RootNavigator
        screenProps={{
          gameroom,
          gameState,
          players,
          points,
          session,
          team,
          onSignIn: onSignIn || this.handleOnSignIn,
          onSignUp: onSignUp || this.handleOnSignUp,
          doSignOut: doSignOut || this.handleOnSignOut,
          handleSetAppState: this.handleSetAppState,
          handleSetRole: this.handleSetRole,
          auth: Auth,
          IOTPublishMessage: this.IOTPublishMessage,
          IOTSubscribeToTopic: this.IOTSubscribeToTopic,
          IOTUnsubscribeFromTopic: this.IOTUnsubscribeFromTopic,
        }}
      />
    );
  }
}

App.router = RootNavigator.router;
