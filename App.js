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
import {
  putTeacherAccountToDynamoDB,
  getTeacherAccountFromDynamoDB,
  putTeacherItemInDynamoDB,
  getTeacherItemFromDynamoDB,
} from './lib/Categories/DynamoDB/TeacherAccountsAPI';
import { putStudentAccountToDynamoDB, getStudentAccountFromDynamoDB } from './lib/Categories/DynamoDB/StudentAccountsAPI';

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


  setSession(session) {
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


  handleOnSignIn(session, role) {
    this.setSession(session);
    if (session && (session.username || (session.idToken && session.idToken.payload))) {
      const username = session.username || session.idToken.payload['cognito:username'];
      if (role === 'teacher' && username !== this.state.account.TeacherID) {
        // Hydrate LocalStorage w/ new user's DynamoDB
        this.hydrateNewTeacherData(username);
      } else if (role === 'student' && username !== this.state.account.StudentID) {
        this.hydrateNewStudentData(username);
      }
    }
  }


  handleOnSignUp(accountType, username) {
    const deviceSettings = {};
    const account = {};
    deviceSettings.username = username;
    const date = Date.now();
    account.signUpDate = date;

    if (accountType === 'teacher') {
      account.TeacherID = username;
      account.gamesCreated = 0;
      account.gamesPlayed = 0;
      account.schoolID = null;
      account.games = { local: 0, db: 0 };
      account.favorites = { local: 0, db: 0 };
      account.history = { local: 0, db: 0 };

      deviceSettings.quizTime = '1:00';
      deviceSettings.trickTime = '3:00';
      deviceSettings.role = 'teacher';

      LocalStorage.setItem(`@RightOn:${username}/Games`, '[]');
      LocalStorage.setItem(`@RightOn:${username}/History`, '[]');

      putTeacherAccountToDynamoDB(
        account,
        res => debug.log('Successfully PUT new teacher account into DynamoDB', res),
        exception => debug.warn('Error PUTTING new teacher account into DynamoDB', exception),
      );

      putTeacherItemInDynamoDB(
        'TeacherGamesAPI',
        account.TeacherID,
        { games: [] },
        res => debug.log('Successfully PUT teacher games into DynamoDB', res),
        exception => debug.warn('Error PUTTING teacher games into DynamoDB', exception),
      );

      putTeacherItemInDynamoDB(
        'TeacherHistoryAPI',
        account.TeacherID,
        { history: [] },
        res => debug.log('Successfully PUT teacher history into DynamoDB', res),
        exception => debug.warn('Error PUTTING teacher history into DynamoDB', exception),
      );
    } else if (accountType === 'student') {
      account.StudentID = username;
      account.age = this.state.deviceSettings.age || null;
      account.gamesPlayed = 0;
      account.playersTricked = 0;
      account.tricksSuggested = 0;
      account.points = 0;

      deviceSettings.age = this.state.deviceSettings.age || null;
      deviceSettings.role = 'student';
      deviceSettings.ID = `${Math.random()}`;

      putStudentAccountToDynamoDB(
        account,
        res => debug.log('Successfully PUT new student account into DynamoDB', res),
        exception => debug.warn('Error PUTTING new student account into DynamoDB', exception),
      );
    }

    this.setState({
      account,
      deviceSettings,
    });
    
    const stringifiedAccount = JSON.stringify(account);
    LocalStorage.setItem(`@RightOn:${username}`, stringifiedAccount);

    const stringifiedDeviceSettings = JSON.stringify(deviceSettings);
    LocalStorage.setItem('@RightOn:DeviceSettings', stringifiedDeviceSettings);
  }


  handleOnSignOut() {
    Auth.signOut();
    this.setState({ session: null });
  }


  handleSetAppState(property, value) {
    switch (property) {
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
      default:
        break;
    }
  }


  hydrateNewStudentData(StudentID) {
    getStudentAccountFromDynamoDB(
      StudentID,
      (res) => {
        this.setState({ account: res });
        const accountJSON = JSON.stringify(res);
        LocalStorage.setItem(`@RightOn:${StudentID}`, accountJSON);
        this.resetDeviceSettings('student', StudentID);
        debug.log('Result from GETTING student account from DynamoDB:', JSON.stringify(res));
      },
      exception => debug.warn('Error GETTING student account from DynamoDB:', JSON.stringify(exception)),
    );
  }


  hydrateNewTeacherData(TeacherID) {
    getTeacherAccountFromDynamoDB(
      TeacherID,
      (res) => {
        this.setState({ account: res });
        const accountJSON = JSON.stringify(res);
        LocalStorage.setItem(`@RightOn:${TeacherID}`, accountJSON);
        this.resetDeviceSettings('teacher', TeacherID);
        debug.log('Result from GETTING teacher account from DynamoDB:', JSON.stringify(res));
      },
      exception => debug.warn('Error GETTING teacher account from DynamoDB:', JSON.stringify(exception)),
    );

    getTeacherItemFromDynamoDB(
      'TeacherGamesAPI',
      TeacherID,
      (res) => {
        const gamesJSON = JSON.stringify(res.games);
        LocalStorage.setItem(`@RightOn:${TeacherID}/Games`, gamesJSON);
        debug.log('Result from GETTING teacher games from DynamoDB:', JSON.stringify(res));
      },
      exception => debug.warn('Error GETTING teacher games from DynamoDB:', JSON.stringify(exception)),
    );

    getTeacherItemFromDynamoDB(
      'TeacherFavoritesAPI',
      TeacherID,
      (res) => {
        const favoritesJSON = JSON.stringify(res.favorites);
        LocalStorage.setItem(`@RightOn:${TeacherID}/Favorites`, favoritesJSON);
        debug.log('Result from GETTING teacher favorites from DynamoDB:', JSON.stringify(res));
      },
      exception => debug.warn('Error GETTING teacher favorites from DynamoDB:', JSON.stringify(exception)),
    );

    getTeacherItemFromDynamoDB(
      'TeacherHistoryAPI',
      TeacherID,
      (res) => {
        const historyJSON = JSON.stringify(res.history);
        LocalStorage.setItem(`@RightOn:${TeacherID}/History`, historyJSON);
        debug.log('Result from GETTING teacher history from DynamoDB:', JSON.stringify(res));
      },
      exception => debug.warn('Error GETTING teacher history from DynamoDB:', JSON.stringify(exception)),
    );
  }


  resetDeviceSettings(accountType, username) {
    const deviceSettings = {};
    deviceSettings.username = username;
    deviceSettings.role = accountType;
    if (accountType === 'teacher') {
      deviceSettings.quizTime = this.state.deviceSettings.quizTime || '1:00';
      deviceSettings.trickTime = this.state.deviceSettings.trickTime || '3:00';
    }
    this.setState({ deviceSettings });
    const deviceSettingsJSON = JSON.stringify(deviceSettings);
    LocalStorage.setItem('@RightOn:DeviceSettings', deviceSettingsJSON);
  }


  IOTSubscribeToTopic(topic) {
    const { role } = this.state.deviceSettings;
    debug.log('Subscribing to topic:', topic, 'as', role);
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
      const accountString = await LocalStorage.getItem(`@RightOn:${username}`);
      if (typeof accountString === 'string') {
        const account = JSON.parse(accountString);
        this.setState({ account });
      }
    } catch (exception) {
      debug.log('Error loading account settings from LocalStorage:', exception);
    }
  }


  async loadDeviceSettingsFromLocalStorage(signInWithoutPassword) {
    try { 
      const deviceSettingsString = await LocalStorage.getItem('@RightOn:DeviceSettings');
      if (typeof deviceSettingsString === 'string') {
        const deviceSettings = JSON.parse(deviceSettingsString);
        debug.log('DeviceSettings:', deviceSettingsString);
        if (signInWithoutPassword && deviceSettings.role && deviceSettings.username) {
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


  updateAccountInDynamoDB(role) {
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
          onSignIn: this.handleOnSignIn,
          onSignUp: this.handleOnSignUp,
          doSignOut: this.handleOnSignOut,

          IOTPublishMessage: this.IOTPublishMessage,
          IOTSubscribeToTopic: this.IOTSubscribeToTopic,
          IOTUnsubscribeFromTopic: this.IOTUnsubscribeFromTopic,
        }}
      />
    );
  }
}

App.router = RootNavigator.router;
