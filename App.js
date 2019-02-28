import Buffer from 'buffer';

global.Buffer = global.Buffer || Buffer.Buffer; // Required for aws sigv4 signing

import React from 'react';
import { AppState, YellowBox } from 'react-native';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import { attachIotPolicy, IOTSubscribeToTopic, unsubscribeFromTopic, publishMessage } from './lib/Categories/IoT';
import studentMessageHandler from './lib/Categories/IoT/studentMessageHandler';
import teacherMessageHandler from './lib/Categories/IoT/teacherMessageHandler';

import { deleteGameFromDynamoDB } from './lib/Categories/DynamoDB/TeacherGameRoomAPI';
import { putTeacherAccountToDynamoDB } from './lib/Categories/DynamoDB/TeacherAccountsAPI';
import { putStudentAccountToDynamoDB } from './lib/Categories/DynamoDB/StudentAccountsAPI';

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
  constructor(props) {
    super(props);

    this.accountUpdated = false;
    this.messagesReceived = {};
    this.requestAttempts = 0;

    // The application core state that gets passed down the Navigator's screenProps.
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
  }

  /**
   * Main application upon mount lifecycle event.
   * Initiates LocalStorage and gets session from Auth to set in core state.
   * 
   * Sets up background listener to handle Websocket connectivity.
   */
  async componentDidMount() {
    await LocalStorage.init();
    let session;
    try {
      session = await Auth.currentSession();
    } catch (err) {
      debug.log(err);
      session = null;
    }
    this.setSession(session);

    AppState.addEventListener('change', this.handleAppStateChange);
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.appState !== nextState.appState) return false;
    return true;
  }


  componentWillUnmount() {
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
    if (this.accountUpdated) {
      this.updateAccountInDynamoDB(role);
    }
  }


  setSession = (session) => {
    this.setState({
      session,
      ready: true,
    }, () => {
      debug.log('Setting session & loading local settings from Local Storage');
      if (session && (session.username || (session.idToken && session.idToken.payload))) {
        const username = session.username || session.idToken.payload['cognito:username'];
        debug.log('Current session username:', username);
        if (username) {
          this.loadAccountSettingsFromLocalStorage(username);
        }
        this.loadDeviceSettingsFromLocalStorage();
      } else {
        this.loadDeviceSettingsFromLocalStorage('signInWithoutPassword');
      }
      attachIotPolicy();
    });
  }

  /**
   * Local storage access of specific user's account settings.
   * @param username Email of user
   */
  loadAccountSettingsFromLocalStorage = async (username) => {
    try { 
      const accountString = await LocalStorage.getItem(`@RightOn:${username}`);
      if (typeof accountString === 'string') {
        const account = JSON.parse(accountString);
        this.setState({ account });
      }
    } catch (exception) {
      debug.log('Error loading account settings from LocalStorage:', exception);
    }
  }


  /**
   * Local storage access of specific user's device settings.
   * @param signInWithoutPassword Action conditional for automatically signing
   * in user if username is provided from a previous session.
   */
  loadDeviceSettingsFromLocalStorage = async (signInWithoutPassword) => {
    try { 
      const deviceSettingsString = await LocalStorage.getItem('@RightOn:DeviceSettings');
      if (typeof deviceSettingsString === 'string') {
        const deviceSettings = JSON.parse(deviceSettingsString);
        debug.log('DeviceSettings:', deviceSettingsString);
        if (signInWithoutPassword &&
          deviceSettings.role &&
          (deviceSettings.username && isNaN(parseInt(deviceSettings.username, 10)))) {
          debug.log('Attempting to sign in without password with username:', deviceSettings.username);
          Auth.signIn(deviceSettings.username)
            .then((session) => {
              this.setState({
                deviceSettings,
                session,
              });
              debug.log('Signed in without password:', JSON.stringify(session));
            })
            .catch((exception) => {
              this.setSession({ deviceSettings });
              debug.log('Error signing in without password', JSON.stringify(exception));
            });

          this.loadAccountSettingsFromLocalStorage(deviceSettings.username);
        } else {
          this.setState({ deviceSettings });
        }
      }
    } catch (exception) {
      debug.log('Error loading device settings from LocalStorage:', exception);
    }
  }

  /**
   * Background listener for subscribing/unsubscribing from GameRoom topic.
   * @param nextAppState Returned event argument from the listener function.
   */
  handleAppStateChange = (nextAppState) => {
    const { appState, GameRoomID } = this.state;
    if (GameRoomID) {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        debug.log('App has come to the foreground - resubscribing to GameRoom:', GameRoomID);
        this.IOTSubscribeToTopic(GameRoomID, 'dropped');

        const { role, username } = this.state.deviceSettings;
        if (role === 'student') {
          setTimeout(() => {
            const message = {
              action: 'REQUEST_DROPPED_GAME_STATE',
              uid: `${Math.random()}`,
              username,
            };
            this.IOTPublishMessage(message);
          }, 1000);
        }
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        debug.log('App going into background - unsubscribing from GameRoom:', GameRoomID);
        this.IOTUnsubscribeFromTopic(GameRoomID);
      }
    }
    this.setState({ appState: nextAppState });
  }


  handleOnSignOut = () => {
    Auth.signOut();
    this.setState({ session: null });
  }

  /**
   * Main application core state update function.
   * @param property Property key to update.
   * @param value Value of property to update with.
   */
  handleSetAppState = (property, value) => {
    switch (property) {
      case 'session': 
        this.setSession(value);
        break;
      case 'account':
        this.setState({ account: { ...this.state.account, ...value } }, () => {
          if (this.state.deviceSettings.username) {
            const stringifiedAccount = JSON.stringify(this.state.account);
            LocalStorage.setItem(`@RightOn:${this.state.deviceSettings.username}`, stringifiedAccount);
            this.accountUpdated = true;
          }
        });
        break;
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
          LocalStorage.setItem('@RightOn:DeviceSettings', stringifiedDeviceSettings);
        });
        break;
      case 'reset':
        this.setState({
          account: {},
          deviceSettings: {},
          gameState: {},
          GameRoomID: '',
          players: {},
          points: 0,
          session: null,
          team: null,
        });
        break;
      default:
        break;
    }
  }


  IOTSubscribeToTopic = (topic, dropped) => {
    const { role } = this.state.deviceSettings;
    debug.log('Subscribing to topic:', topic, 'as', role);
    IOTSubscribeToTopic(topic, role === 'teacher' ? teacherMessageHandler : studentMessageHandler, this);
    if (role !== 'teacher' && !dropped) {
      const requestMessage = {
        action: 'REQUEST_GAME_STATE',
        uid: `${Math.random()}`,
      };
      // Throttle the publishMessage() so PubSub is given time to connect to the GameRoom first.
      setTimeout(() => publishMessage(topic, requestMessage), 1000);
    }
    debug.log('Subscribed to GameRoom:', topic);
  }


  IOTUnsubscribeFromTopic = () => {
    const { GameRoomID } = this.state;
    unsubscribeFromTopic(GameRoomID);
  }


  IOTPublishMessage = (message) => {
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


  /**
   * Duo account type function for writing directly to an account's DynamoDB table.
   * @param role Type of user: teacher || student.
   */
  updateAccountInDynamoDB = (role) => {
    const { account } = this.state;
    if (role === 'teacher') {
      putTeacherAccountToDynamoDB(
        account,
        res => debug.log('Successfully PUT updated teacher account into DynamoDB', res),
        exception => debug.warn('Error PUTTING updated teacher account into DynamoDB', exception),
      );
    } else {
      putStudentAccountToDynamoDB(
        account,
        res => debug.log('Successfully PUT updated student account into DynamoDB', res),
        exception => debug.warn('Error PUTTING updated student account into DynamoDB', exception),
      );
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
      session,
      team,
    } = this.state;

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
          
          handleSetAppState: this.handleSetAppState,
          
          auth: Auth,
          doSignOut: this.handleOnSignOut,

          IOTPublishMessage: this.IOTPublishMessage,
          IOTSubscribeToTopic: this.IOTSubscribeToTopic,
          IOTUnsubscribeFromTopic: this.IOTUnsubscribeFromTopic,
        }}
      />
    );
  }
}

// Pass router to RootNavigator for hooking it into the navigation paradigm.
App.router = RootNavigator.router;
