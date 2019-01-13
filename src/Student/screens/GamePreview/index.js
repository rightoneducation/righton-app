import React from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { scale } from 'react-native-size-matters';
import Message from '../../../components/Message';
import InputModal from '../../../components/InputModal';
import HeaderTeam from '../../components/HeaderTeam';
import Instructions from '../../../components/Instructions';
import ButtonRound from '../../../components/ButtonRound';
import { deviceWidth } from '../../../utils/theme';
import styles from './styles';


export default class GamePreview extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({ type: PropTypes.any }),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      team: PropTypes.number.isRequired,
    }),
  }
  
  static defaultProps = {
    screenProps: {
      gameState: {
        team0: {
          answer: __DEV__ ? 'Bagel' : '',
          image: '',
          instructions: __DEV__ ? ['Look up and to the left', 'Think back to earlier this morning', 'What was the texture of your food?', 'What did it smell like?', 'How was it cooked or prepared?', 'Who made breakfast this morning?', 'Do you want to eat it again right now?', 'What was it?!'] : [],
          question: __DEV__ ? 'What did you eat for breakfast?' : '',
          tricks: [],
          uid: '',
        },
      },
      handleSetAppState: () => {},
      IOTPublishMessage: () => {},
      team: 0,
    },
  }

  constructor(props) {
    super(props);

    this.animationTimeout = null;
    this.animationInterval = null;

    this.animatedArrow1 = new Animated.Value(0);
    this.animatedArrow2 = new Animated.Value(0);
    this.animatedArrow3 = new Animated.Value(0);

    this.state = {
      messageProps: {},
      showInput: false,
      showInstructions: false,
    };

    this.handleCloseMessage = this.handleCloseMessage.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    this.toggleInstructions = this.toggleInstructions.bind(this);
  }


  componentDidMount() {
    this.animationTimeout = setTimeout(() => this.startAnimation(), 59250);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      if (nextProps.screenProps.gameState.state.endGame === true) {
        this.props.navigation.navigate('Dashboard');
        return;
      }
      if (this.props.screenProps.gameState.state.startQuiz !==
        nextProps.screenProps.gameState.state.startQuiz) {
        if (nextProps.screenProps.gameState.state.teamRef === `team${this.props.screenProps.team}`) {
          this.props.navigation.navigate('GameReasons');
        } else {
          this.props.navigation.navigate('GameQuiz');
        }
      }
    }
  }


  componentWillUnmount() {
    clearTimeout(this.animationTimeout);
    clearInterval(this.animationInterval);
  }


  startAnimation() {
    this.animationInterval = setInterval(() => this.startArrowAnimation(), 3500);
  }


  toggleInstructions() {
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


  startArrowAnimation() {
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


  handleInputModal() {
    this.setState({
      showInput: {
        autoCapitalize: 'sentences',
        closeModal: this.closeInputModal,
        keyboardType: 'default',
        height: 45,
        input: '',
        inputLabel: '',
        maxLength: 125,
        multiline: true,
        placeholder: 'Enter a trick answer',
        visible: true,
        spellCheck: true,
        width: deviceWidth - scale(30),
      }
    });
  }


  closeInputModal(input) {
    this.setState({ showInput: false });
    if (input) {
      const { handleSetAppState, IOTPublishMessage, team } = this.props.screenProps;
      const teamRef = `team${team}`;
      const uid = `${Math.random()}`;
      const message = {
        action: 'PUSH_TEAM_TRICK',
        payload: { selected: false, uid, value: input, },
        teamRef,
        uid,
      };
      IOTPublishMessage(message);
      const { gameState } = this.props.screenProps;
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
  handleTrickSelection(trick, index, gameState, teamRef) {
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
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Maximum of three tricks selected.',
          timeout: 4000,
        },
      });
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


  handleCloseMessage() {
    this.setState({ messageProps: {} });
  }


  renderArrowButton = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={this.toggleInstructions}
      style={styles.arrowButton}
    >
      <Animated.View style={[styles.arrow, styles.arrow1, { opacity: this.animatedArrow1 }]} />
      <Animated.View style={[styles.arrow, styles.arrow2, { opacity: this.animatedArrow2 }]} />
      <Animated.View style={[styles.arrow, styles.arrow3, { opacity: this.animatedArrow3 }]} />
    </TouchableOpacity>
  )


  renderQuestion() {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{ gameState[teamRef].question }</Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={styles.image} />} 
      </View>
    );
  }


  renderTricks(gameState, teamRef) {
    const { tricks } = gameState[teamRef];
    if (!tricks.length) return null;

    return (
      <View style={styles.tricksWrapper}>
        <Text style={[styles.choiceAnswer, styles.marginBottom]}>
          Select at least three trick answers
        </Text>
        <View style={styles.tricksContainer}>
          {tricks.map((trick, idx) => (
            <View
              key={trick.uid}
              style={styles.trickItem}
            >
              <Touchable
                activeOpacity={0.8}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={() => this.handleTrickSelection(trick, idx, gameState, teamRef)}
              >
                <View style={[styles.trickButton, trick.selected && styles.trickButtonSelected]} />
              </Touchable>
              <Text style={styles.trickValue}>{ trick.value }</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }


  render() {
    const {
      messageProps,
      showInput,
      showInstructions
    } = this.state;

    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Message {...messageProps} />
        {showInput && <InputModal {...showInput} />}
        <HeaderTeam team={`Team ${team + 1}`} />
        {this.renderQuestion()}
        {this.renderTricks(gameState, teamRef)}
        {!showInstructions && this.renderArrowButton()}
        {showInstructions &&
          <Instructions
            handleCloseModal={this.toggleInstructions}
            data={gameState[teamRef].instructions}
            visible={showInstructions}
          />}
        {!showInstructions && !showInput &&
          <ButtonRound
            icon={'pencil-square-o'}
            onPress={this.handleInputModal}
          />}
      </ScrollView>
    );
  }
}
