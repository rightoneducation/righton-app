import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import gamePreviewStyles from '../GamePreview/styles';


export default class GameQuiz extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({}),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
    }),
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({}),
      }),
    }),
  }

  static defaultProps = {
    screenProps: {
      gameState: {},
      handleSetAppState: () => {},
      IOTPublishMessage: () => {},
    },
    navigation: {
      navigate: () => {},
      state: {
        params: {},
      },
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedChoice: null,
      timeLeft: props.screenProps.gameState.quizTime && props.screenProps.gameState.quizTime !== '0:00' ?
        props.screenProps.gameState.quizTime : 'No time limit',
    };

    this.timerInterval = undefined;
    this.countdownTime = this.countdownTime.bind(this);
  }


  componentDidMount() {
    if (this.props.screenProps.gameState.quizTime && this.props.screenProps.gameState.quizTime !== '0:00') {
      this.timerInterval = setInterval(this.countdownTime, 1000);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      if (nextProps.screenProps.gameState.state.endGame === true) {
        this.props.navigation.navigate('GameFinal');
        return;
      }
      if (nextProps.screenProps.gameState.state.endQuiz === true) {
        if (this.state.timeLeft !== 'Time is up!') {
          this.publishChoice();
          clearInterval(this.timerInterval);
          this.setState({ timeLeft: 'Time is up!' });
        }
      } else if (nextProps.screenProps.gameState.state.startQuiz === true &&
        nextProps.screenProps.gameState.state.teamRef === `team${this.props.screenProps.team}`) {
        this.props.navigation.navigate('GameReasons');
      }
    }
  }


  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }


  handleCheckAndPoints() {
    const { selectedChoice } = this.state;
    const { gameState, handleSetAppState } = this.props.screenProps;
    const { teamRef } = gameState.state;
    if (gameState[teamRef].choices[selectedChoice].correct) {
      handleSetAppState('points', 50);
      return 50;
    }
    return 0;
  }

  
  countdownTime() {
    const { timeLeft } = this.state;
    const seconds = parseInt(timeLeft.substr(timeLeft.indexOf(':') + 1), 10);
    const minutes = parseInt(timeLeft.substr(0, timeLeft.indexOf(':')), 10);
    let newTimeLeft = '';
    if (seconds > 10) {
      newTimeLeft = `${minutes}:${seconds - 1}`;
    } else if (seconds > 0) {
      newTimeLeft = `${minutes}:0${seconds - 1}`;
    } else if (seconds === 0 && minutes > 0) {
      newTimeLeft = `${minutes - 1}:59`;
    } else if (seconds === 0 && minutes === 0) {
      this.publishChoice();
      clearInterval(this.timerInterval);
      newTimeLeft = 'Time is up!';
    }
    this.setState({ timeLeft: newTimeLeft });
  }


  publishChoice() {
    const { selectedChoice } = this.state;
    if (typeof selectedChoice !== 'number') return;
    const { team } = this.props.screenProps;
    const { teamRef } = this.props.screenProps.gameState.state;
    const message = {
      action: 'UPDATE_PLAYER_CHOICE_AND_TEAM_POINTS',
      uid: `${Math.random()}`,
      teamRef,
      index: selectedChoice,
      points: {
        teamRef: `team${team}`,
        value: this.handleCheckAndPoints(),
      }
    };
    this.props.screenProps.IOTPublishMessage(message);
  }


  handleChoiceSelection(value) {
    const { timeLeft } = this.state;
    if (timeLeft !== 'Time is up!') {
      this.setState({ selectedChoice: value });
    }
  }


  render() {
    const { gameState } = this.props.screenProps;
    const { teamRef } = gameState.state;

    const { selectedChoice, timeLeft } = this.state;
    
    return (
      <ScrollView
        contentContainerStyle={gamePreviewStyles.container}
      >
        {Boolean(timeLeft) &&
          <View style={gamePreviewStyles.timeContainer}>
            <Text style={gamePreviewStyles.time}>{ timeLeft }</Text>
          </View>}
        <View style={gamePreviewStyles.questionContainer}>
          <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
          {Boolean(gameState[teamRef].image) &&
            <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} />} 
        </View>
        <View style={gamePreviewStyles.choiceContainerWrapper}>
          <View style={gamePreviewStyles.choicesContainer}>
            {gameState[teamRef].choices.map((choice, idx) => (
              Object.keys(choice).length &&
              <Touchable
                activeOpacity={0.8}
                key={choice.value}
                onPress={() => this.handleChoiceSelection(idx)}
              >
                <View style={gamePreviewStyles.choiceContainer}>
                  <View 
                    style={[
                      gamePreviewStyles.choiceDot,
                      selectedChoice === idx && gamePreviewStyles.choiceSelected,
                    ]}
                  />
                  <Text style={gamePreviewStyles.choiceValue}>{ choice.value }</Text>
                </View>
              </Touchable>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}
