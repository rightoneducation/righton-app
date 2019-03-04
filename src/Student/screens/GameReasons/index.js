import React from 'react';
import {
  findNodeHandle,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { cancelCountdownTimer, requestCountdownTimer } from '../../../utils/countdownTimer';
import NativeMethodsMixin from 'NativeMethodsMixin';
import { scale, ScaledSheet } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import Touchable from 'react-native-platform-touchable';
import HeaderTeam from '../../components/HeaderTeam';
import InputModal from '../../../components/InputModal';
import gamePreviewStyles from '../GamePreview/styles';
import { colors, deviceWidth, elevation, fonts } from '../../../utils/theme';
import { handleExitGame } from '../../../utils/studentGameUtils';


export default class GameReasons extends React.PureComponent {
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

    const { quizTime } = props.screenProps.gameState;
    this.state = {
      showInput: false,
      timeLeft: quizTime && quizTime !== '0:00' ? quizTime : 'No time limit',
      trick0Reason: '',
      trick1Reason: '',
      trick2Reason: '',
      tricks: [],
    };

    this.timerInterval = undefined;
  }


  componentDidMount() {
    const { quizTime } = this.props.screenProps.gameState;
    if (quizTime && quizTime !== '0:00') {
      requestCountdownTimer(quizTime, this.setTime);
    }
    this.parseTricks();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      const { navigation } = this.props;
      if (nextProps.screenProps.gameState.state.endGame === true) {
        navigation.navigate('GameFinal');
        return;
      }
      if (nextProps.screenProps.gameState.state.startQuiz &&
        nextProps.screenProps.gameState.state.teamRef !== `team${this.props.screenProps.team}`) {
        navigation.navigate('GameQuiz');
      }
      if (nextProps.screenProps.gameState.state.exitGame === true) {
        const { handleSetAppState, IOTUnsubscribeFromTopic } = this.props.screenProps;
        handleExitGame(handleSetAppState, IOTUnsubscribeFromTopic, navigation);
      }
    }
  }


  componentWillUnmount() {
    cancelCountdownTimer();
  }


  onTrick0Layout() {
    if (this.trick0Ref) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.trick0Ref),
        (x, y) => {
          this.trick0X = x;
          this.trick0Y = y + 9 + fonts.medium;
        }
      );
    }
  }


  onTrick1Layout() {
    if (this.trick1Ref) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.trick1Ref),
        (x, y) => {
          this.trick1X = x;
          this.trick1Y = y + 9 + fonts.medium;
        }
      );
    }
  }


  onTrick2Layout() {
    if (this.trick2Ref) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.trick2Ref),
        (x, y) => {
          this.trick2X = x;
          this.trick2Y = y + 9 + fonts.medium;
        }
      );
    }
  }


  setTime = timeLeft => this.setState({ timeLeft });

  
  parseTricks() {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;
    const tricks = [];
    for (let i = 0; i < gameState[teamRef].tricks.length; i += 1) {
      if (gameState[teamRef].tricks[i].selected) {
        tricks.push(gameState[teamRef].tricks[i].value);
      }
    }
    this.setState({ tricks });
  }


  handleTrick0Ref = (ref) => {
    this.trick0Ref = ref;
  }


  handleTrick1Ref = (ref) => {
    this.trick1Ref = ref;
  }


  handleTrick2Ref = (ref) => {
    this.trick2Ref = ref;
  }


  closeInputModal = (input, inputLabel) => {
    switch (inputLabel) {
      case 'trick0':
        this.setState({ trick0Reason: input, showInput: false });
        break;
      case 'trick1':
        this.setState({ trick1Reason: input, showInput: false });
        break;
      case 'trick2':
        this.setState({ trick2Reason: input, showInput: false });
        break;
      default:
        break;
    }
  }


  handleInputModal = (inputLabel, placeholder, maxLength, input, keyboardType = 'default') => {
    if (inputLabel === 'trick0') {
      this.onTrick0Layout();
    } else if (inputLabel === 'trick1') {
      this.onTrick1Layout();
    } else if (inputLabel === 'trick2') {
      this.onTrick2Layout();
    } 
    setTimeout(() => {
      this.setState({
        showInput: {
          autoCapitalize: 'sentences',
          closeModal: this.closeInputModal,
          keyboardType,
          input,
          inputLabel,
          maxLength,
          multiline: false,
          placeholder,
          visible: true,
          spellCheck: true,
          width: deviceWidth - scale(30),
          x: this[`${inputLabel}X`],
          y: this[`${inputLabel}Y`],
        }
      });
    }, 100);
  }


  handleTrick0 = () => this.setState({ currentTrick: 0 });


  handleTrick1 = () => this.setState({ currentTrick: 1 });


  handleTrick2 = () => this.setState({ currentTrick: 2 });


  renderQuestion() {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <View style={[gamePreviewStyles.questionContainer, styles.extraMarginBottom]}>
        <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} resizeMode={'contain'} />} 
      </View>
    );
  }


  render() {
    const {
      showInput,
      timeLeft,
      trick0Reason,
      trick1Reason,
      trick2Reason,
      tricks,
    } = this.state;

    const { team } = this.props.screenProps;

    return (
      <ScrollView 
        contentContainerStyle={[gamePreviewStyles.container, styles.container]}
      >
        { Platform.OS === 'ios' && <KeepAwake /> }

        {showInput &&
          <InputModal {...showInput} />}
        <HeaderTeam team={`Team ${team + 1}`} />
        {Boolean(timeLeft) &&
          <View style={gamePreviewStyles.timeContainer}>
            <Text style={gamePreviewStyles.time}>{ timeLeft }</Text>
          </View>}
        {this.renderQuestion()}
        <View style={styles.extraMarginBottom}>
          {tricks[0] ?
            <Text style={[
              gamePreviewStyles.question,
              gamePreviewStyles.time,
              gamePreviewStyles.marginBottom
            ]}
            >
              Jot down a few notes for why your team chose each trick answer:
            </Text> :
            <Text style={[
              gamePreviewStyles.question,
              gamePreviewStyles.time,
              gamePreviewStyles.marginBottom
            ]}
            >
              Explain why your team did not come up with trick answers:
            </Text>}

          <View>
            {tricks[0] ?
              <View
                onLayout={this.onTrick0Layout}
                ref={this.handleTrick0Ref}
                style={[styles.inputContainer, gamePreviewStyles.marginBottom]}
              >
                <Text style={[gamePreviewStyles.choiceValue, gamePreviewStyles.marginBottom]}>
                  { `Trick Answer #1. ${tricks[0]}` }
                </Text>
                <Touchable
                  onPress={() => this.handleInputModal('trick0', 'Enter your reason', 500, trick0Reason)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text style={[styles.inputButtonText, !trick0Reason && styles.placeholder]}>{trick0Reason || 'Enter your reason'}</Text>
                </Touchable>
              </View> :
              <View
                onLayout={this.onTrick0Layout}
                ref={this.handleTrick0Ref}
                style={[styles.inputContainer, gamePreviewStyles.marginBottom]}
              >
                <Text style={[gamePreviewStyles.choiceValue, gamePreviewStyles.marginBottom]}>
                  Our reason is because...
                </Text>
                <Touchable
                  onPress={() => this.handleInputModal('trick0', 'Enter your reason', 500, trick0Reason)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text style={[styles.inputButtonText, !trick0Reason && styles.placeholder]}>{trick0Reason || 'Enter your reason'}</Text>
                </Touchable>
              </View>}

            {tricks[1] &&
              <View
                onLayout={this.onTrick1Layout}
                ref={this.handleTrick1Ref}
                style={[styles.inputContainer, gamePreviewStyles.marginBottom]}
              >
                <Text style={[gamePreviewStyles.choiceValue, gamePreviewStyles.marginBottom]}>
                  { `Trick Answer #2. ${tricks[1]}` }
                </Text>
                <Touchable
                  onPress={() => this.handleInputModal('trick1', 'Enter your reason', 500, trick1Reason)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text style={[styles.inputButtonText, !trick1Reason && styles.placeholder]}>{trick1Reason || 'Enter your reason'}</Text>
                </Touchable>
              </View>}

            {tricks[2] &&
              <View
                onLayout={this.onTrick2Layout}
                ref={this.handleTrick2Ref}
                style={[styles.inputContainer, gamePreviewStyles.marginBottom]}
              >
                <Text style={[gamePreviewStyles.choiceValue, gamePreviewStyles.marginBottom]}>
                  { `Trick Answer #3. ${tricks[2]}` }
                </Text>
                <Touchable
                  onPress={() => this.handleInputModal('trick2', 'Enter your reason', 500, trick2Reason)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text style={[styles.inputButtonText, !trick2Reason && styles.placeholder]}>{trick2Reason || 'Enter your reason'}</Text>
                </Touchable>
              </View>}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flexGrow: 1,
  },
  extraMarginBottom: {
    marginBottom: '35@vs',
  },
  inputButton: {
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: '15@ms',
    paddingVertical: '15@ms',
    width: deviceWidth - scale(30),
  },
  inputButtonText: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  inputContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginTop: '15@vs',
  },
  placeholder: {
    color: colors.lightGray,
  },
});
