import Buffer from 'buffer';

global.Buffer = global.Buffer || Buffer.Buffer; // Required for aws sigv4 signing

import React from 'react';
import { YellowBox } from 'react-native';
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
    // 'You should only render one navigator explicitly in your app,',
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

    this.state = {
      gameState: {},
      ready: false,
      role: '', // 'Teacher' | 'Student'
      session: null,
      team: null,
    };

    this.handleOnSignIn = this.handleOnSignIn.bind(this);
    // this.handleOnSignUp = this.handleOnSignUp.bind(this);
    this.handleOnSignOut = this.handleOnSignOut.bind(this);
    this.handleSetGameState = this.handleSetGameState.bind(this);
    this.handleSetRole = this.handleSetRole.bind(this);

    this.IOTSubscribeToTopic = this.IOTSubscribeToTopic.bind(this);
    // this.IOTUnsubscribeFromTopic = this.IOTUnsubscribeFromTopic.bind(this);
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
  }

  setSession(session) {
    this.setState({
      session,
      ready: true,
    });
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

  handleSetGameState(gameState) {
    this.setState({ gameState });
  }

  IOTSubscribeToTopic(topic) {
    const { role } = this.state;
    IOTSubscribeToTopic(topic, role === 'Teacher' ? teacherMessageHandler : studentMessageHandler, this);
    if (role !== 'Teacher') {
      const requestObj = {
        action: 'REQUEST_GAME_STATE',
        uid: `${Math.random()}`,
      };
      const requestMessage = JSON.stringify(requestObj);
      // Throttle the publishMessage() so PubSub is given time to connect to the GameRoom first.
      setTimeout(() => publishMessage(topic, requestMessage), 1000);
    }
    debug.log('Subscribed to GameRoom:', topic);
  }

  IOTUnsubscribeFromTopic() {
    const { GameRoomID } = this.state.gameState;
    unsubscribeFromTopic(GameRoomID);
  }

  IOTPublishMessage(message, uid) {
    const { GameRoomID } = this.state.gameState;
    // Prevent computing received messages sent by self.
    this.messagesReceived[uid] = true;
    publishMessage(GameRoomID, message);
  }

  render() {
    const { 
      gameState,
      // ready,
      session,
      team,
    } = this.state;

    const {
      onSignIn,
      onSignUp,
      doSignOut,
      // ...otherProps
    } = this.props;

    return (
      <RootNavigator
        ref={(nav) => {
          this.navigator = nav;
        }}
        navigation={this.props.navigation}
        screenProps={{
          gameState,
          session,
          team,
          onSignIn: onSignIn || this.handleOnSignIn,
          onSignUp: onSignUp || this.handleOnSignUp,
          doSignOut: doSignOut || this.handleOnSignOut,
          handleSetGameState: this.handleSetGameState,
          handleSetRole: this.handleSetRole,
          auth: Auth,
          IOTPublishMessage: this.IOTPublishMessage,
          IOTSubscribeToTopic: this.IOTSubscribeToTopic,
        }}
      />
    );
  }
}

App.router = RootNavigator.router;
