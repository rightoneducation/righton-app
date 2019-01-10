import React from 'react';
import {
  findNodeHandle,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import NativeMethodsMixin from 'NativeMethodsMixin';
import { scale, ScaledSheet } from 'react-native-size-matters';
import Touchable from 'react-native-platform-touchable';
import HeaderTeam from '../../components/HeaderTeam';
import InputModal from '../../../components/InputModal';
import gamePreviewStyles from '../GamePreview/styles';
import { colors, deviceWidth, elevation, fonts } from '../../../utils/theme';


export default class GameReasons extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({ type: PropTypes.any }),
      IOTPublishMessage: PropTypes.func.isRequired,
      team: PropTypes.number.isRequired,
    }),
  }
  
  static defaultProps = {
    screenProps: {
      gameState: {
        team0: {
          instructions: __DEV__ ? ['Look up and to the left', 'Think back to earlier this morning', 'What was the texture of your food?', 'What did it smell like?', 'How was it cooked or prepared?', 'Who made breakfast this morning?', 'Do you want to eat it again right now?', 'What was it?!'] : [],
          question: __DEV__ ? 'What did you eat for breakfast?' : '',
          team: __DEV__ ? 'Scool' : '',
        },
      },
      IOTPublishMessage: () => {},
      team: 0,
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      showInput: false,
      trick0Reason: '',
      trick1Reason: '',
      trick2Reason: '',
    };

    this.onTrick0Layout = this.onTrick0Layout.bind(this);
    this.handleTrick0Ref = this.handleTrick0Ref.bind(this);
    this.onTrick1Layout = this.onTrick1Layout.bind(this);
    this.handleTrick1Ref = this.handleTrick1Ref.bind(this);
    this.onTrick2Layout = this.onTrick2Layout.bind(this);
    this.handleTrick2Ref = this.handleTrick2Ref.bind(this);

    this.handleInputModal = this.handleInputModal.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.gameState.state.startQuiz !==
      nextProps.screenProps.gameState.state.startQuiz &&
      this.props.screenProps.gameState.state.endQuiz !== true) {
      this.props.navigation.navigate('GameQuiz');
    }
  }


  onTrick0Layout() {
    if (this.trick0Ref) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.trick0Ref),
        (x, y) => {
          this.trick0X = x;
          this.trick0Y = y + 9;
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
          this.trick1Y = y + 9;
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
          this.trick2Y = y + 9;
        }
      );
    }
  }


  handleTrick0Ref(ref) {
    this.trick0Ref = ref;
  }


  handleTrick1Ref(ref) {
    this.trick1Ref = ref;
  }


  handleTrick2Ref(ref) {
    this.trick2Ref = ref;
  }


  closeInputModal(input, inputLabel) {
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


  handleInputModal(inputLabel, placeholder, maxLength, input, keyboardType = 'default') {
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
          height: 45,
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


  handleTrick0() {
    this.setState({ currentTrick: 0 });
  }


  handleTrick1() {
    this.setState({ currentTrick: 1 });
  }


  handleTrick2() {
    this.setState({ currentTrick: 2 });
  }


  renderQuestion() {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <View style={gamePreviewStyles.questionContainer}>
        <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} />} 
      </View>
    );
  }


  render() {
    const {
      showInput,
      trick0Reason,
      trick1Reason,
      trick2Reason,
    } = this.state;

    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <ScrollView 
        contentContainerStyle={[gamePreviewStyles.container, styles.container]}
      >
        {showInput &&
          <InputModal {...showInput} />}
        <HeaderTeam team={gameState[teamRef].team} />
        {this.renderQuestion()}
        <View>
          <View>
            <View
              onLayout={this.onTrick0Layout}
              ref={this.handleTrick0Ref}
              style={styles.inputContainer}
            >
              <Text style={gamePreviewStyles.choiceAnswer}>{ gameState[teamRef].tricks[0] }</Text>
              <Touchable
                onPress={() => this.handleInputModal('trick0', 'Enter your reason', 500, trick0Reason)}
                style={[styles.inputButton, elevation]}
              >
                <Text style={[styles.inputButtonText, !trick0Reason && styles.placeholder]}>{trick0Reason || 'Enter your reason'}</Text>
              </Touchable>
            </View>

            <View
              onLayout={this.onTrick1Layout}
              ref={this.handleTrick1Ref}
              style={styles.inputContainer}
            >
              <Text style={gamePreviewStyles.choiceAnswer}>{ gameState[teamRef].tricks[1] }</Text>
              <Touchable
                onPress={() => this.handleInputModal('trick1', 'Enter your reason', 500, trick1Reason)}
                style={[styles.inputButton, elevation]}
              >
                <Text style={[styles.inputButtonText, !trick1Reason && styles.placeholder]}>{trick1Reason || 'Enter your reason'}</Text>
              </Touchable>
            </View>

            <View
              onLayout={this.onTrick2Layout}
              ref={this.handleTrick2Ref}
              style={styles.inputContainer}
            >
              <Text style={gamePreviewStyles.choiceAnswer}>{ gameState[teamRef].tricks[2] }</Text>
              <Touchable
                onPress={() => this.handleInputModal('trick2', 'Enter your reason', 500, trick2Reason)}
                style={[styles.inputButton, elevation]}
              >
                <Text style={[styles.inputButtonText, !trick2Reason && styles.placeholder]}>{trick2Reason || 'Enter your reason'}</Text>
              </Touchable>
            </View>
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
