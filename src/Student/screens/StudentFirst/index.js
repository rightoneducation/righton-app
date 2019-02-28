import React from 'react';
import {
  NetInfo,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { getGameFromDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherGameRoomAPI';
import { verticalScale } from 'react-native-size-matters';
import Touchable from 'react-native-platform-touchable';
import Portal from '../../../screens/Portal';
import Message from '../../../components/Message';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import { colors, fonts } from '../../../utils/theme';
import styles from './styles';
import debug from '../../../utils/debug';


export default class StudentFirst extends React.PureComponent {
  static propTypes = {
    screenProps: screenPropsPropTypes,
    navigation: navigationPropTypes,
  }

  static defaultProps = {
    screenProps: screenPropsDefaultProps,
    navigation: navigationDefaultProps,
  }

  constructor(props) {
    super(props);

    this.state = {
      messageProps: null,
      portal: null,
      room: '',
    };
  }


  componentWillUnmount() {
    this.props.screenProps.handleSetAppState('deviceSettings', { role: 'student' });
  }


  onRoomInput = room => this.setState({ room });


  onRoomSubmit = () => {
    this.handleGameEntry();
  }


  onJoinLater = () => {
    this.props.navigation.navigate('StudentApp');
  }


  handleGameEntry = () => {
    const { room } = this.state;
    const GameRoomID = room;
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
              bodyStyle: { bottom: verticalScale(140) },
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
                bodyStyle: { bottom: verticalScale(140) },
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
              bodyStyle: { bottom: verticalScale(140) },
              textStyle: null,
              duration: null,
              message: 'Entered game room. Select your team.',
              timeout: 4000,
            },
          });
          this.props.screenProps.handleSetAppState('GameRoomID', res.GameRoomID);
          setTimeout(() => this.props.navigation.navigate('StudentApp'), 0);
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
          bodyStyle: { bottom: verticalScale(140) },
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
        bodyStyle: { bottom: verticalScale(140) },
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


  handleNavigateToOnboardApp = () => {
    this.props.navigation.navigate('OnboardAppRouter');
  }


  render() {
    const {
      messageProps,
      portal,
      room,
    } = this.state;
    
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
        <ButtonBack
          buttonStyles={{ top: 40 }}
          onPress={this.handleNavigateToOnboardApp}
        />
        <Text style={styles.title}>Game Code</Text>
        <TextInput
          keyboardType={'numeric'}
          maxLength={4}
          multiline={false}
          onChangeText={this.onRoomInput}
          onSubmitEditing={this.onRoomSubmit}
          placeholder={'####'}
          placeholderTextColor={colors.primary} 
          returnKeyType={'done'}
          style={styles.input}
          textAlign={'center'}
          underlineColorAndroid={colors.dark}   
          value={room}
        />
        <Touchable
          activeOpacity={0.8}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={this.onJoinLater}
          style={GameRoomStyles.skipButton}
        >
          <Text style={GameRoomStyles.skip}>Join later</Text>
        </Touchable>
        <ButtonWide
          label={'Enter Game'}
          onPress={this.onRoomSubmit}
        />

        {messageProps && <Message {...messageProps} />}

      </View>
    );
  }
}


const GameRoomStyles = StyleSheet.create({
  skip: {
    color: colors.primary,
    fontSize: fonts.medium,
  },
  skipButton: {
    bottom: verticalScale(100),
    position: 'absolute',
  },
});
