import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { cancelCountdownTimer, requestCountdownTimer } from '../../../utils/countdownTimer';
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

    const { quizTime, state } = props.screenProps.gameState;
    this.state = {
      selectedChoice: null,
      timeLeft: quizTime && quizTime !== '0:00' ? quizTime : 'No time limit',
      teamRef: (state && state.teamRef) || 'team0', // What does 'team0' do that's wrong in this case?
      published: false,
    };
  }


  componentDidMount() {
    const { quizTime } = this.props.screenProps.gameState;
    if (quizTime && quizTime !== '0:00') {
      requestCountdownTimer(quizTime, this.setTime);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      const { navigation } = this.props;
      if (nextProps.screenProps.gameState.state.endGame === true) {
        if (this.state.timeLeft !== 'Time is up!') {
          this.publishChoice();
          cancelCountdownTimer();
        }
        navigation.navigate('GameFinal');
        return;
      }
      if (nextProps.screenProps.gameState.state.endQuiz === true) {
        if (this.state.timeLeft !== 'Time is up!') {
          this.publishChoice();
          cancelCountdownTimer();
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
    cancelCountdownTimer();
  }


  setTime = timeLeft => this.setState({ timeLeft });


  resetState(teamRef) {
    // const now = Date.now();
    // const quizTime = this.props.screenProps.gameState.quizTime;
    // const timeLeft = time - now
    const { quizTime } = this.props.screenProps.gameState;
    this.setState({
      selectedChoice: null,
      timeLeft: quizTime && quizTime !== '0:00' ? quizTime : 'No time limit',
      teamRef,
      published: false,
    }, () => {
      if (quizTime && quizTime !== '0:00') {
        requestCountdownTimer(quizTime, this.setTime);
      }
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
            <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} resizeMode={'contain'} />} 
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
