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
import PropTypes from 'prop-types';
import { getGameFromDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherAPI';
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
    screenProps: PropTypes.shape({ type: PropTypes.any }),
  };
  
  static defaultProps = {
    screenProps: {
      gameState: {},
      handleSetRole: () => {},
      IOTSubscribeToTopic: () => {},
      IOTPublishMessage: () => {},
      navigation: {
        navigate: () => {},
      }
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {
      messageProps: null,
      name: '',
      portal: '',
      room: '',
      roomEntry: true,
    };

    this.roomRef = null;
    this.attemptedEntries = 0;

    this.handleCloseMessage = this.handleCloseMessage.bind(this);

    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);

    this.handleRoomInput = this.handleRoomInput.bind(this);
    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    this.handleRoomRef = this.handleRoomRef.bind(this);

    this.handleGameEntry = this.handleGameEntry.bind(this);
    this.handleGameError = this.handleGameError.bind(this);
    this.handleGameFound = this.handleGameFound.bind(this);

    this.handleKeyboardHide = this.handleKeyboardHide.bind(this);
    this.handleKeyboardShow = this.handleKeyboardShow.bind(this);
  }


  componentDidMount() {
    if (this.props.screenProps.navigation.state && this.props.screenProps.navigation.state.params &&
      this.props.screenProps.navigation.state.params.GameRoomID) {
      this.handleParamRoomEntry();
    }
    this.props.screenProps.handleSetRole('Student');
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState && nextProps.screenProps.gameState.state &&
      nextProps.screenProps.gameState.state.start === true && typeof nextProps.screenProps.team === 'number') {
      this.setState({ portal: '5' });
      setTimeout(() => this.setState({ portal: '4' }), 1000);
      setTimeout(() => this.setState({ portal: '3' }), 2000);
      setTimeout(() => this.setState({ portal: '2' }), 3000);
      setTimeout(() => this.setState({ portal: '1' }), 4000);
      setTimeout(() => this.setState({ portal: '1' }), 4000);
      setTimeout(() => this.setState({ portal: 'RightOn!' }), 5000);
      setTimeout(() => this.props.screenProps.navigation.navigate('GamePreview'), 6000);      
    }
  }


  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide);
    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShow);
  }


  handleParamRoomEntry() {
    this.setState({ room: this.props.screenProps.navigation.state.params.GameRoomID },
      () => this.handleGameEntry());
  }


  handleKeyboardHide() {
    this.setState({ roomEntry: true }, () => {
      if (this.roomRef) this.roomRef.blur();
    });
  }


  handleKeyboardShow() {
    this.setState({ roomEntry: false });
  }


  handleNameInput(name) {
    this.setState({ name });
  }


  handleNameSubmit = () => (
    Keyboard.dismiss()
  )


  handleRoomInput(room) {
    this.setState({ room });
  }


  handleRoomSubmit = () => (
    Keyboard.dismiss()
  )


  handleRoomRef(ref) {
    this.roomRef = ref;
  }


  handleGameEntry() {
    const { room } = this.state;
    this.setState({ portal: `Joining ${room}` });
    NetInfo.isConnected.fetch()
      .then(async (isConnected) => {
        if (isConnected) {
          getGameFromDynamoDB(room, this.handleGameFound, this.handleGameError);
        } else {
          this.setState({
            closeFunc: this.handleCloseMessage,
            bodyStyle: null,
            textStyle: null,
            duration: null,
            message: 'Network error.',
            timeout: 4000,
          });
        }
      });
  }


  handleGameFound(res) {
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


  handleCloseMessage() {
    this.setState({ messageProps: null });
  }


  handleTeamSelection(idx) {
    const team = idx;
    this.props.screenProps.handleSetAppState('team', team);
    this.setState({ portal: 'Waiting for other players' });
    const message = {
      action: 'JOINED_GAME',
      uid: `${Math.random()}`,
      payload: {
        playerID: `${Math.random()}`, // TODO! Make a device specific ID in local storage | Player name
        team: idx,
      },
    };
    this.props.screenProps.IOTPublishMessage(message);
  }


  renderHeader = () => (
    <View style={[styles.headerContainer, elevation]}>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
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


  renderProfileView() {
    const { name } = this.state;

    const { gamesPlayed, pointsEarned } = this.props.screenProps;
    // TODO Where are these values being hydrated from?

    return (
      <View style={styles.profileContainer}>
        <TextInput
          keyboardType={'default'}
          maxLength={23}
          multiline={false}
          onChangeText={this.handleNameInput}
          onSubmitEditing={this.handleNameSubmit}
          placeholder={'Team Name'}
          placeholderTextColor={colors.primary}
          returnKeyType={'done'}
          style={styles.input}
          textAlign={'center'}
          underlineColorAndroid={name ? colors.white : colors.dark}
          value={name}
        />
        <View style={styles.profileValuesContainer}>
          <View style={styles.profileValueContainer}>
            <Text style={styles.profileValueLabel}>{'Games: '}</Text>
            <Text style={styles.profileValue}>{ gamesPlayed || '--' }</Text>
          </View>
          <View style={styles.profileValueContainer}>
            <Text style={styles.profileValueLabel}>{'Points: '}</Text>
            <Text style={styles.profileValue}>{ pointsEarned || '--' }</Text>
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
    teamsArr[teamSize - 1] = true;
    return (
      <View style={styles.roomContainer}>
        {teamsArr.map((n, idx) => (
          <Touchable
            activeOpacity={0.8}
            background={Touchable.Ripple(colors.primary, false)}
            hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
            onPress={() => this.handleTeamSelection(idx)}
            key={`${Math.random()}`}
            style={[styles.teamButton, elevation]}
          >
            <Text style={styles.buttonText}>{idx + 1}</Text>
          </Touchable>
        ))}
      </View>
    );
  }


  renderGameRoomEntry(roomEntry) {
    const { room } = this.state;
    return (
      <View style={[styles.roomContainer, { justifyContent: 'center' }]}>
        <TextInput
          keyboardType={'default'}
          maxLength={30}
          multiline={false}
          onChangeText={this.handleRoomInput}
          onSubmitEditing={this.handleRoomSubmit}
          placeholder={'Game room'}
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
        <Text style={styles.buttonText}>Top 10</Text>
      </Touchable>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Invite Friends</Text>
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
        <ScrollView
          keyboardShouldPersistTaps={'never'}
          contentContainerStyle={styles.scrollview}
        >
          {this.renderProfileView()}

          {typeof gameState === 'object' && Object.keys(gameState).length ?
            this.renderGameRoomTeamSelection(gameState) :
            this.renderGameRoomEntry(roomEntry)}

          {this.renderButtons()}
        </ScrollView>
      </View>
    );
  }
}
