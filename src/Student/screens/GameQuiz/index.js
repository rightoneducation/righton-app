import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import Touchable from 'react-native-platform-touchable';
import KeepAwake from 'react-native-keep-awake';
import gamePreviewStyles from '../GamePreview/styles';
import { handleExitGame } from '../../../utils/studentGameUtils';


export default class GameQuiz extends React.Component {
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
      selectedChoice: null,
      timeLeft: props.screenProps.gameState.quizTime && props.screenProps.gameState.quizTime !== '0:00' ?
        props.screenProps.gameState.quizTime : 'No time limit',
      teamRef: (props.screenProps.gameState.state && props.screenProps.gameState.state.teamRef) || 'team0',
      published: false,
    };

    this.timerInterval = undefined;
  }


  componentDidMount() {
    if (this.props.screenProps.gameState.quizTime && this.props.screenProps.gameState.quizTime !== '0:00') {
      this.timerInterval = setInterval(this.countdownTime, 1000);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      const { navigation } = this.props;
      if (nextProps.screenProps.gameState.state.endGame === true) {
        if (this.state.timeLeft !== 'Time is up!') {
          this.publishChoice();
          clearInterval(this.timerInterval);
        }
        navigation.navigate('GameFinal');
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
        navigation.navigate('GameReasons');
      } else if (nextProps.screenProps.gameState.state.startQuiz === true &&
        nextProps.screenProps.gameState.state.teamRef !== this.state.teamRef) {
        this.resetState(
          nextProps.screenProps.gameState.state.teamRef,
          // nextProps.screenProps.gameState.state.time,
        );
      }

      if (nextProps.screenProps.gameState.state.exitGame === true) {
        const { handleSetAppState, IOTUnsubscribeFromTopic } = this.props.screenProps;
        handleExitGame(handleSetAppState, IOTUnsubscribeFromTopic, navigation);
      }
    }
  }


  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }


  resetState(teamRef) {
    // const now = Date.now();
    // const quizTime = this.props.screenProps.gameState.quizTime;
    // const timeLeft = time - now
    this.setState({
      selectedChoice: null,
      timeLeft: this.props.screenProps.gameState.quizTime && this.props.screenProps.gameState.quizTime !== '0:00' ?
        this.props.screenProps.gameState.quizTime : 'No time limit',
      teamRef,
      published: false,
    }, () => {
      this.timerInterval = setInterval(this.countdownTime, 1000);
    });
  }


  handleCheckAndPoints() {
    const { selectedChoice } = this.state;
    const { gameState, handleSetAppState } = this.props.screenProps;
    const { teamRef } = gameState.state;
    if (selectedChoice !== null && gameState[teamRef].choices[selectedChoice].correct) {
      handleSetAppState('points', 25);
      return 25;
    }
    return 0;
  }

  
  countdownTime = () => {
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
    const { published, selectedChoice } = this.state;
    if (published) return;
    this.setState({ published: true });
    if (selectedChoice === null) return;
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

    if (!teamRef) return null;

    const { selectedChoice, timeLeft } = this.state;
    
    return (
      <ScrollView
        contentContainerStyle={gamePreviewStyles.container}
      >
        { Platform.OS === 'ios' && <KeepAwake /> }

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
                      gamePreviewStyles.choiceButton,
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
