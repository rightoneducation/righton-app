import React from 'react';
import {
  Animated,
  Image,
  InteractionManager,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { cancelCountdownTimer, startCountdownTimer } from '../../../utils/countdownTimer';
import renderHyperlinkedText from '../../../utils/renderHyperlinkedText';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { scale } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import Message from '../../../components/Message';
import InputModal from '../../../components/InputModal';
import HeaderTeam from '../../components/HeaderTeam';
import Instructions from '../../../components/Instructions';
import ButtonRound from '../../../components/ButtonRound';
import ButtonAnimated from '../../../components/ButtonAnimated';
import WebView from '../../../components/WebView';
import { handleExitGame } from '../../../utils/studentGameUtils';
import { colors, deviceWidth } from '../../../utils/theme';
import styles from './styles';


export default class GamePreview extends React.PureComponent {
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

    this.animationTimeout = null;
    this.animationInterval = null;

    this.animatedArrow1 = new Animated.Value(0);
    this.animatedArrow2 = new Animated.Value(0);
    this.animatedArrow3 = new Animated.Value(0);

    const { trickTime } = props.screenProps.gameState;
    const { params } = props.navigation.state;
    let timeLeft;
    if (params && params.time) {
      // timeLeft = trickTime === '0:00' ? 'No time limit' : params.time;
      timeLeft = 'Time is up!';
    } else {
      timeLeft = trickTime === '0:00' ? 'No time limit' : trickTime;
    }

    this.state = {
      hyperlink: '',
      instructions: [],
      instructionIndex: 0,
      messageProps: {},
      showInput: false,
      showInstructions: false,
      timeLeft,
    };
  }


  componentDidMount() {
    const { trickTime } = this.props.screenProps.gameState;
    const { params } = this.props.navigation.state;
    const time = params && params.time ? params.time : trickTime;

    const minute = parseInt(time.substr(0, 1), 10);
    
    if (minute <= 1) {
      this.startAnimation();
    } else {
      this.animationTimeout = setTimeout(() => {
        this.startAnimation();
        this.handleShowMessage('Tap the arrow\nto view answer');
      }, 59250);
    }
    startCountdownTimer(params, trickTime, this.setTime);
    
    InteractionManager.runAfterInteractions(this.setupInstructions());
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      const { navigation } = this.props;

      if (nextProps.screenProps.gameState.state.endGame === true) {
        navigation.navigate('GameFinal');
        return;
      }
      if (this.props.screenProps.gameState.state.startQuiz !==
        nextProps.screenProps.gameState.state.startQuiz) {
        cancelCountdownTimer();
        this.setState({ timeLeft: 'Time is up!' });
        if (nextProps.screenProps.gameState.state.teamRef === `team${this.props.screenProps.team}`) {
          navigation.navigate('GameReasons');
        } else {
          navigation.navigate('GameQuiz');
        }
      }
      if (nextProps.screenProps.gameState.state.exitGame === true) {
        const { handleSetAppState, IOTUnsubscribeFromTopic } = this.props.screenProps;
        handleExitGame(handleSetAppState, IOTUnsubscribeFromTopic, navigation);
      }
    }
  }


  componentWillUnmount() {
    clearTimeout(this.animationTimeout);
    clearInterval(this.animationInterval);
    cancelCountdownTimer();
  }


  setupInstructions = () => {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;
    const { answer, instructions } = gameState[teamRef];
    if (!instructions) {
      this.setState({ instructions: [answer] });
    } else if (instructions[instructions.length - 1] !== answer) {
      this.setState({ instructions: [...instructions, answer] });
    } else {
      this.setState({ instructions });
    }
  }


  setTime = timeLeft => this.setState({ timeLeft });


  startAnimation = () => {
    this.animationInterval = setInterval(() => this.startArrowAnimation(), 3500);
  }
  

  toggleInstructions = () => {
    const { showInstructions } = this.state;
    if (showInstructions) {
      this.setState({ showInstructions: false }, () => {
        this.startAnimation();
      });
    } else {
      clearInterval(this.animationInterval);
      this.setState({ showInstructions: true });
    }
  }


  incrementInstruction = () => this.setState({ instructionIndex: this.state.instructionIndex + 1 });


  startArrowAnimation = () => {
    Animated.parallel([
      Animated.timing(
        this.animatedArrow3, {
          toValue: 1,
          duration: 750,
        }
      ),
      Animated.timing(
        this.animatedArrow2, {
          toValue: 1,
          duration: 1500
        }
      ),
      Animated.timing(
        this.animatedArrow1, {
          toValue: 1,
          duration: 2000
        }
      ),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(
          this.animatedArrow1, {
            toValue: 0,
            duration: 2000,
          }
        ),
        Animated.timing(
          this.animatedArrow2, {
            toValue: 0,
            duration: 1500,
          }
        ),
        Animated.timing(
          this.animatedArrow3, {
            toValue: 0,
            duration: 750,
          }
        ),
      ]).start();
    }, 1250);
  }


  handleInputModal = () => {
    this.setState({
      showInput: {
        autoCapitalize: 'sentences',
        closeModal: this.closeInputModal,
        keyboardType: 'default',
        input: '',
        inputLabel: '',
        maxLength: 125,
        multiline: false,
        placeholder: 'Enter a trick answer',
        visible: true,
        spellCheck: true,
        width: deviceWidth - scale(30),
      }
    });
  }


  closeInputModal = (input) => {
    this.setState({ showInput: false });
    if (input && this.state.timeLeft !== 'Time is up!') {
      const { gameState, handleSetAppState, IOTPublishMessage, team } = this.props.screenProps;
      const { answer } = gameState[`team${team}`];
      if (input.toLowerCase() === answer.toLowerCase()) {
        this.handleShowMessage('That\'s the right answer! \nEnter a trickier answer.');
        return;
      }
      const teamRef = `team${team}`;
      const uid = `${Math.random()}`;
      const message = {
        action: 'PUSH_TEAM_TRICK',
        payload: { selected: false, uid, value: input, },
        teamRef,
        uid,
      };
      if (gameState[`team${team}`].tricks.length < 3) {
        // Automatically select the first three tricks.
        message.payload.selected = true;
      }
      IOTPublishMessage(message);
      const updatedGameState = { ...gameState };
      updatedGameState[teamRef].tricks.push(message.payload);
      handleSetAppState('gameState', updatedGameState);
    }
  }


  /**
   * Updates `choicesList` for all players including teacher.
   *
   * @param {object} choice
   * ex: {
   *  value: `string`,
   *  selected: `boolean`,
   * }
   */
  handleTrickSelection = (trick, index, gameState, teamRef) => {
    const { handleSetAppState, IOTPublishMessage } = this.props.screenProps;
    const message = {
      action: 'UPDATE_TEAM_TRICK',
      index,
      teamRef,
      uid: `${Math.random()}`,
    };
    let selectedTricks = 0;
    for (let i = 0; i < gameState[teamRef].tricks.length; i += 1) {
      if (gameState[teamRef].tricks[i].selected) {
        selectedTricks += 1;
      }
    }
    if (trick.selected === false && selectedTricks === 3) {
      this.handleShowMessage('Maximum of three trick answers selected.');
      return;
    } else if (trick.selected) {
      message.payload = false;
    } else {
      message.payload = true;
    }
    IOTPublishMessage(message);
    const updatedGameState = { ...gameState };
    updatedGameState[teamRef].tricks[index].selected = message.payload;
    handleSetAppState('gameState', updatedGameState);
  }


  handleOpenLink = hyperlink => this.setState({ hyperlink, showInstructions: false });


  handleCloseLink = () => this.setState({ hyperlink: '' });


  handleShowMessage = (message) => {
    this.setState({
      messageProps: {
        closeFunc: this.handleCloseMessage,
        message,
      },
    });
  }


  handleCloseMessage = () => this.setState({ messageProps: {} });


  renderArrowButton = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      hitSlop={{ top: 25, right: 25, bottom: 25, left: 25 }}
      onPress={this.toggleInstructions}
      style={styles.arrowButton}
    >
      <Animated.View style={[styles.arrow, styles.arrow1, { opacity: this.animatedArrow1 }]} />
      <Animated.View style={[styles.arrow, styles.arrow2, { opacity: this.animatedArrow2 }]} />
      <Animated.View style={[styles.arrow, styles.arrow3, { opacity: this.animatedArrow3 }]} />
    </TouchableOpacity>
  )


  renderQuestion = () => {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>
          { renderHyperlinkedText(
            gameState[teamRef].question,
            {},
            { color: colors.primary },
            this.handleOpenLink)}
        </Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={styles.image} resizeMode={'contain'} />} 
      </View>
    );
  }


  renderTricks = (gameState, teamRef) => {
    const { tricks } = gameState[teamRef];
    if (!tricks.length) return null;

    return (
      <View style={styles.tricksWrapper}>
        <Text style={[styles.choiceValue, styles.marginBottom]}>
          Brainstorm trick answers and then work with your team to select the best three.
        </Text>
        <View style={styles.tricksContainer}>
          {tricks.map((trick, idx) => (
            <View
              key={trick.uid}
              style={styles.choiceItem}
            >
              <Touchable
                activeOpacity={0.8}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={() => this.handleTrickSelection(trick, idx, gameState, teamRef)}
              >
                <View style={[styles.choiceButton, styles.choiceSquare]}>
                  {trick.selected &&
                    <Aicon name={'check'} style={styles.choiceCheck} />}
                </View>
              </Touchable>
              <Text style={styles.choiceValue}>{ `${idx + 1}. ` }</Text>                
              <Text style={styles.choiceValue}>{ trick.value }</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }


  render() {
    const {
      hyperlink,
      instructions,
      instructionIndex,
      messageProps,
      showInput,
      showInstructions,
      timeLeft,
    } = this.state;

    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    let showInputButton = true;
    const renderAnimatedButton = !gameState[teamRef].tricks.length;
    if (showInstructions && showInput) {
      showInputButton = false;
    }

    return (
      <View style={styles.flex}>
        <ScrollView contentContainerStyle={[styles.container, styles.extraPaddingBottom]}>
          <KeepAwake />

          <Message {...messageProps} />
          {showInput && <InputModal {...showInput} />}

          <HeaderTeam team={`Team ${parseInt(team, 10) + 1}`} />
          {this.renderQuestion()}
          {this.renderTricks(gameState, teamRef)}
          {!showInstructions && this.renderArrowButton()}
          {showInstructions &&
            <Instructions
              handleCloseModal={this.toggleInstructions}
              handleOpenLink={this.handleOpenLink}
              incrementInstruction={this.incrementInstruction}
              instructionIndex={instructionIndex}
              data={instructions}
              visible={showInstructions}
            />}
        </ScrollView>
        {Boolean(timeLeft) &&
          <Text style={styles.timeContainer}>{ timeLeft }</Text>}
        {showInputButton && !renderAnimatedButton &&
          <ButtonRound
            icon={'pencil-square-o'}
            onPress={this.handleInputModal}
          />}
        {showInputButton && renderAnimatedButton &&
          <ButtonAnimated
            icon={'pencil-square-o'}
            onPress={this.handleInputModal}
          />}
        {Boolean(hyperlink) &&
          <Modal
            animationType={'fade'}
            onRequestClose={this.handleCloseLink}
            transparent={false}
          >
            <View style={styles.container}>
              <KeepAwake />
              {Boolean(timeLeft) &&
                <Text style={styles.timeContainer}>{ timeLeft }</Text>}
              <WebView
                handleClose={this.handleCloseLink}
                hyperlink={hyperlink}
              />
            </View>
          </Modal>}
      </View>
    );
  }
}
