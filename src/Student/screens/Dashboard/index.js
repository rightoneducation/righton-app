import React from 'react';
import {
  Keyboard,
  NetInfo,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { getGameFromDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherGameRoomAPI';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import Portal from '../../../screens/Portal';
import ButtonWide from '../../../components/ButtonWide';
import Message from '../../../components/Message';
import styles from './styles';
import { colors, elevation } from '../../../utils/theme';
import debug from '../../../utils/debug';


export default class Dashboard extends React.Component {
  static propTypes = {
    screenProps: screenPropsPropTypes,
  };
  
  static defaultProps = {
    screenProps: screenPropsDefaultProps,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      messageProps: null,
      portal: '',
      room: '',
      roomEntry: true,
    };

    this.startingGame = false;
    this.roomRef = null;
    this.attemptedEntries = 0;
  }


  componentDidMount() {
    if (this.props.screenProps.navigation.state && this.props.screenProps.navigation.state.params &&
      this.props.screenProps.navigation.state.params.GameRoomID) {
      this.handleParamRoomEntry();
      this.props.screenProps.navigation.state.params = {};
    }
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
    this.mounted = true;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      if (nextProps.screenProps.gameState.state.endGame === true) {
        this.setState({ portal: '' });
        return;
      }
      if (nextProps.screenProps.gameState.state.newGame) {
        this.setState({ portal: 'Game is preparing...' });
        return;
      }
      if (nextProps.screenProps.gameState.state.start === true &&
        nextProps.screenProps.team !== null &&
        !this.startingGame) {
        this.startingGame = true;
        this.setState({ portal: '5' });
        setTimeout(() => this.mounted && this.setState({ portal: '4' }), 1000);
        setTimeout(() => this.mounted && this.setState({ portal: '3' }), 2000);
        setTimeout(() => this.mounted && this.setState({ portal: '2' }), 3000);
        setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
        setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
        setTimeout(() => this.mounted && this.setState({ portal: 'RightOn!' }), 5000);
        setTimeout(() => {
          this.startingGame = false;
          if (this.mounted) this.props.screenProps.navigation.navigate('GamePreview');
        }, 6000);      
      }
    }
  }


  componentWillUnmount() {
    this.mounted = false;
    Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide);
    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShow);
  }


  handleParamRoomEntry = () => {
    this.setState({ room: this.props.screenProps.navigation.state.params.GameRoomID },
      () => this.handleGameEntry());
  }


  handleKeyboardHide = () => {
    this.setState({ roomEntry: true }, () => {
      if (this.roomRef) this.roomRef.blur();
    });
  }


  handleKeyboardShow = () => {
    this.setState({ roomEntry: false });
  }


  handleRoomInput = room => this.setState({ room });


  handleRoomSubmit = () => (
    Keyboard.dismiss()
  )


  handleRoomRef = (ref) => {
    this.roomRef = ref;
  }


  handleGameEntry = () => {
    const { room } = this.state;
    let GameRoomID = '';
    if (room) {
      GameRoomID = room;
    } else if (this.props.screenProps.GameRoomID) {
      GameRoomID = this.props.screenProps.GameRoomID;
      this.setState({ room: GameRoomID });
    }
    this.setState({ portal: `Joining ${GameRoomID}` });
    NetInfo.isConnected.fetch()
      .then(async (isConnected) => {
        if (isConnected) {
          getGameFromDynamoDB(GameRoomID, this.handleGameFound, this.handleGameError);
        } else {
          this.setState({
            portal: '',
            messageProps: {
              closeFunc: this.handleCloseMessage,
              bodyStyle: null,
              textStyle: null,
              duration: null,
              message: 'Network connection error.',
              timeout: 4000,
            },
          });
        }
      });
  }


  handleGameFound = (res) => {
    if (typeof res === 'object' && res.GameRoomID) {
      this.props.screenProps.IOTSubscribeToTopic(res.GameRoomID);
      setTimeout(() => {
        const { gameState } = this.props.screenProps;
        if (typeof gameState === 'object' && Object.keys(gameState).length === 0) {
          debug.log('Problem joining game room');
          if (this.attemptedEntries < 2) {
            this.props.screenProps.IOTUnsubscribeFromTopic(res.GameRoomID);
            setTimeout(() => this.handleGameEntry(), 500);
            this.attemptedEntries += 1;
          } else {
            this.attemptedEntries = 0;
            this.setState({
              portal: '',
              messageProps: {
                closeFunc: this.handleCloseMessage,
                bodyStyle: null,
                textStyle: null,
                duration: null,
                message: 'Problem joining game. Please try again.',
                timeout: 4000,
              },
            });
          }
        } else {
          this.setState({
            portal: '',
            messageProps: {
              closeFunc: this.handleCloseMessage,
              bodyStyle: null,
              textStyle: null,
              duration: null,
              message: 'Entered game room. Select your team.',
              timeout: 4000,
            },
          });
          this.props.screenProps.handleSetAppState('GameRoomID', res.GameRoomID);
        }
        debug.log('JOIN GAME', res.GameRoomID);
      }, 3000);
    } else {
      // res is most likely an empty object `{}`
      // - either way notify user that GameRoom cannot be joined.
      this.setState({
        portal: '',
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Game room not found.',
          timeout: 4000,
        },
      });
      debug.log('Bad response from getGameFromDynamoDB():', JSON.stringify(res), 'Game Room cannot be found.');
    }
  }


  handleGameError = (exception) => {
    this.setState({
      portal: '',
      messageProps: {
        closeFunc: this.handleCloseMessage,
        bodyStyle: null,
        textStyle: null,
        duration: null,
        message: 'Game room cannot be joined.',
        timeout: 4000,
      },
    });
    debug.log('Error getting game from DynamoDB:', exception);
  }


  handleCloseMessage = () => {
    this.setState({ messageProps: null });
  }


  handleTeamSelection = (idx) => {
    const {
      deviceSettings,
      handleSetAppState,
      IOTPublishMessage,
    } = this.props.screenProps;
    const team = `${idx}`;
    handleSetAppState('team', team);
    this.setState({ portal: 'Waiting for other players' });
    const message = {
      action: 'JOINED_GAME',
      uid: `${Math.random()}`,
      payload: {
        playerID: deviceSettings.username || deviceSettings.ID || `${Math.random()}`,
        team: `${idx}`,
      },
    };
    IOTPublishMessage(message);
  }


  renderHeader = () => (
    <View style={[styles.headerContainer, elevation]}>
      <Touchable
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('StudentProfile')}
        style={styles.headerProfileContainer}
      >
        <Aicon name={'user'} style={styles.headerProfileIcon} />
      </Touchable>
      <Text style={styles.headerTitle}>RightOn!</Text>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
      >
        <Aicon name={'search'} style={styles.headerSearchIcon} />
      </Touchable>
    </View>
  );


  renderProfileView = () => {
    const { gameState, GameRoomID } = this.props.screenProps;

    const { gamesPlayed, points } = this.props.screenProps.account;

    return (
      <View style={styles.profileContainer}>
        <Text style={styles.input}>{ gameState.room ? gameState.room : GameRoomID }</Text>
        <View style={styles.profileValuesContainer}>
          <View style={styles.profileValueContainer}>
            <Text style={styles.profileValueLabel}>{'Games: '}</Text>
            <Text style={styles.profileValue}>{ gamesPlayed || '--' }</Text>
          </View>
          <View style={styles.profileValueContainer}>
            <Text style={styles.profileValueLabel}>{'Points: '}</Text>
            <Text style={styles.profileValue}>{ points || '--' }</Text>
          </View>
        </View>
      </View>
    );
  }


  renderGameRoomTeamSelection = (gameState) => {
    const gameKeys = typeof gameState === 'object' ? Object.keys(gameState) : [];
    const teamsArr = [];
    let teamSize = 0;
    for (let i = 0; i < gameKeys.length; i += 1) {
      if (gameKeys[i].includes('team')) {
        teamSize += 1;
      }
    }
    teamsArr[teamSize - 1] = null;
    teamsArr.fill(null, 0, teamSize - 1);
    return (
      <View style={styles.roomContainer}>
        <ScrollView contentContainerStyle={styles.roomScrollView}>
          <Text style={styles.input}>Select your team</Text>
          {teamsArr.map((n, idx) => (
            <Touchable
              activeOpacity={0.8}
              background={Touchable.Ripple(colors.primary, false)}
              hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
              onPress={() => this.handleTeamSelection(idx)}
              key={`${Math.random()}`}
              style={[styles.teamButton, elevation]}
            >
              <Text style={styles.buttonText}>{`Team ${idx + 1}`}</Text>
            </Touchable>
          ))}
        </ScrollView>
      </View>

    );
  }


  renderGameRoomEntry = (roomEntry) => {
    const { room } = this.state;
    return (
      <View style={[styles.roomContainer, { justifyContent: 'center' }]}>
        <TextInput
          keyboardType={'numeric'}
          maxLength={4}
          multiline={false}
          onChangeText={this.handleRoomInput}
          onSubmitEditing={this.handleRoomSubmit}
          placeholder={'Game code'}
          placeholderTextColor={colors.primary}
          ref={this.handleRoomRef}
          returnKeyType={'done'}
          style={styles.roomInput}
          textAlign={'center'}
          underlineColorAndroid={room ? colors.white : colors.dark}
          value={room}
        />
        {roomEntry &&
        <ButtonWide
          label={'Enter game'}
          onPress={this.handleGameEntry}
        />}
      </View>
    );
  }


  renderButtons = () => (
    <View style={styles.buttonsContainer}>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Stats</Text>
      </Touchable>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Games</Text>
      </Touchable>
    </View>
  )


  render() {
    const {
      messageProps,
      portal,
      roomEntry,
    } = this.state;

    const { gameState } = this.props.screenProps;

    if (portal) {
      return (
        <Portal
          messageType={'single'}
          messageValues={{
            message: portal,
          }}
        />
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />   
        { messageProps && <Message {...messageProps} /> }

        {this.renderHeader()}   
        <View style={styles.dashContainer}>
          {this.renderProfileView()}

          {gameState.state && !gameState.state.endGame ?
            this.renderGameRoomTeamSelection(gameState) :
            this.renderGameRoomEntry(roomEntry)}

          {this.renderButtons()}
        </View>
      </View>
    );
  }
}
