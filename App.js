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
      account: {},
      appState: AppState.currentState,
      deviceSettings: {},
      gameState: {},
      GameRoomID: '',
      players: {},
      points: 0,
      ready: false,
      session: null,
      team: null,
    };

    this.handleOnSignIn = this.handleOnSignIn.bind(this);
    this.handleOnSignUp = this.handleOnSignUp.bind(this);
    this.handleOnSignOut = this.handleOnSignOut.bind(this);
    this.handleSetAppState = this.handleSetAppState.bind(this);
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
      this.loadDeviceSettingsFromLocalStorage();
      if (session && session.idToken && session.idToken.payload) {
        const username = session.idToken.payload['cognito:username'];
        if (username) {
          this.loadAccountSettingsFromLocalStorage(username);
        }
      }
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

    const { role } = this.state.deviceSettings;
    if (role === 'teacher') {
      const { GameRoomID } = this.state;
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
    const { appState, GameRoomID } = this.state;
    if (GameRoomID) {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        debug.log('App has come to the foreground - resubscribing to GameRoom:', GameRoomID);
        this.IOTSubscribeToTopic(GameRoomID);
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        debug.log('App going into background - unsubscribing from GameRoom:', GameRoomID);
        this.IOTUnsubscribeFromTopic(GameRoomID);
      }
    }
    this.setState({ appState: nextAppState });
  }


  handleOnSignIn(session) {
    this.setState({ session });
  }

  handleOnSignUp(accountType, username) {
    const account = {};
    const deviceSettings = {};
    const date = Date.now();
    account.signUpDate = date;

    if (accountType === 'teacher') {
      account.username = username;
      account.gamesPlayed = 0;

      account.games = [];
      account.favorites = [];
      account.history = [];

      deviceSettings.quizTime = '1:00';
      deviceSettings.trickTime = '3:00';
      deviceSettings.role = 'teacher';

      LocalStorage.setItem(`RightOn:${username}/Games`, '[]');
      LocalStorage.setItem(`RightOn:${username}/Recent`, '[]');
    } else if (accountType === 'student') {
      account.username = username;
      account.gamesPlayed = 0;
      account.playersTricked = 0;
      account.tricksSuggested = 0;
      account.points = 0;

      deviceSettings.role = 'student';
    }

    this.setState({
      account,
      deviceSettings,
    });
    
    const stringifiedAccount = JSON.stringify(account);
    LocalStorage.setItem(`RightOn:${username}`, stringifiedAccount);

    const stringifiedDeviceSettings = JSON.stringify(deviceSettings);
    LocalStorage.setItem('RightOn:DeviceSettings', stringifiedDeviceSettings);
  }


  handleOnSignOut() {
    Auth.signOut();
    this.setState({ session: null });
  }


  handleSetAppState(property, value) {
    switch (property) {
      case 'GameRoomID':
        this.setState({ GameRoomID: value });
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
      case 'deviceSettings':
        this.setState({ deviceSettings: { ...this.state.deviceSettings, ...value } }, () => {
          const stringifiedDeviceSettings = JSON.stringify(this.state.deviceSettings);
          LocalStorage.setItem('RightOn:DeviceSettings', stringifiedDeviceSettings);
        });
        break;
      default:
        break;
    }
  }


  IOTSubscribeToTopic(topic) {
    const { role } = this.state.deviceSettings;
    IOTSubscribeToTopic(topic, role === 'teacher' ? teacherMessageHandler : studentMessageHandler, this);
    if (role !== 'teacher') {
      const requestMessage = {
        action: 'REQUEST_GAME_STATE',
        uid: `${Math.random()}`,
      };
      // Throttle the publishMessage() so PubSub is given time to connect to the GameRoom first.
      setTimeout(() => publishMessage(topic, requestMessage), 1000);
    }
    debug.log('Subscribed to GameRoom:', topic);
  }


  IOTUnsubscribeFromTopic() {
    const { GameRoomID } = this.state;
    unsubscribeFromTopic(GameRoomID);
  }


  IOTPublishMessage(message) {
    const { GameRoomID, gameState } = this.state;
    const topic = GameRoomID || gameState.GameRoomID || '';
    if (!topic) {
      debug.warn('Attempted to publish message w/o a GameRoomID set. Message:', JSON.stringify(message));
      return;
    }
    // Prevent computing received messages sent by self.
    this.messagesReceived[message.uid] = true;
    publishMessage(topic, message);
  }


  async loadAccountSettingsFromLocalStorage(username) {
    try { 
      const accountString = await LocalStorage.getItem(`RightOn:${username}`);
      if (typeof accountString === 'string') {
        const account = JSON.parse(accountString);
        this.setState({ account });
      }
    } catch (exception) {
      debug.log('Error loading account settings from LocalStorage:', exception);
    }
  }


  async loadDeviceSettingsFromLocalStorage() {
    try { 
      const deviceSettingsString = await LocalStorage.getItem('RightOn:DeviceSettings');
      if (typeof deviceSettingsString === 'string') {
        const deviceSettings = JSON.parse(deviceSettingsString);
        this.setState({ deviceSettings });
      }
    } catch (exception) {
      debug.log('Error loading device settings from LocalStorage:', exception);
    }
  }


  render() {
    const {
      account,
      deviceSettings,
      GameRoomID,
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
          account,
          deviceSettings,
          GameRoomID,
          gameState,
          players,
          points,
          session,
          team,
          onSignIn: onSignIn || this.handleOnSignIn,
          onSignUp: onSignUp || this.handleOnSignUp,
          doSignOut: doSignOut || this.handleOnSignOut,
          handleSetAppState: this.handleSetAppState,
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
