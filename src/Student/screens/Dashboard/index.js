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
      handleSetRole: () => {},
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
      room: '',
      roomEntry: true,
    };

    this.roomRef = null;

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
    this.props.screenProps.handleSetRole('Student');
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
  }


  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidHide');
    Keyboard.removeListener('keyboardDidShow');
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
      debug.log('JOIN GAME', res.GameRoomID);
      // this.props.screenProps.navigation.navigate('GamePreview');
    } else {
      // res is most likely an empty object `{}` - either way notify user GameRoom cannot be joined.
      this.setState({
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
    // Where are these values being hydrated from?

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


  renderGameRoomState = () => (
    <View style={styles.roomContainer}>
      { /* TODO */ }
    </View>
  );


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
      roomEntry,
    } = this.state;

    const { gameState } = this.props.screenProps;

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

          {Object.keys(gameState).length ?
            this.renderGameRoomState() :
            this.renderGameRoomEntry(roomEntry)}

          {this.renderButtons()}
        </ScrollView>
      </View>
    );
  }
}
