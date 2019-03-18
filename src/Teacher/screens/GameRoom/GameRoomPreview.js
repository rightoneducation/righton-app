import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import { cancelCountdownTimer, requestCountdownTimer } from '../../../utils/countdownTimer';
// import Aicon from 'react-native-vector-icons/FontAwesome';
import KeepAwake from 'react-native-keep-awake';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import Touchable from 'react-native-platform-touchable';
import gamePreviewStyles from '../../../Student/screens/GamePreview/styles';

export default class GameRoomPreview extends React.Component {
  static propTypes = {
    gameState: gameStatePropTypes,
    handleBackFromChild: PropTypes.func.isRequired,
    handleViewResults: PropTypes.func.isRequired,
    handleStartQuiz: PropTypes.func.isRequired,
    teamRef: PropTypes.string.isRequired,
  }
  
  static defaultProps = {
    gameState: gameStateDefaultProps,
    handleBackFromChild: () => {},  
    handleViewResults: () => {},
    handleStartQuiz: () => {},
    teamRef: 'team0',
  }

  constructor(props) {
    super(props);
    this.state = {
      timeLeft: props.gameState.quizTime && props.gameState.quizTime !== '0:00' ?
        props.gameState.quizTime : 'No time limit',
    };
  }

  componentDidMount() {
    const { gameState } = this.props;
    if (gameState.state.startQuiz) {
      if (gameState.quizTime && gameState.quizTime !== '0:00') {
        requestCountdownTimer(gameState.quizTime, this.setTime);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.gameState.state.startQuiz !== nextProps.gameState.state.startQuiz) {
      if (nextProps.gameState.state.startQuiz) {
        requestCountdownTimer(nextProps.gameState.quizTime, this.setTime);
      } else {
        cancelCountdownTimer();
        this.setTime('Time is up!');
      }
    }
  }

  setTime = timeLeft => this.setState({ timeLeft });

  render() {
    const { 
      gameState,
      handleBackFromChild,
      handleStartQuiz,
      handleViewResults,
      teamRef,
    } = this.props;

    const { timeLeft } = this.state;

    const startedQuiz = gameState.state.startQuiz;

    return (
      <View style={gamePreviewStyles.flex}>
        {Boolean(timeLeft) &&
          <Text style={gamePreviewStyles.timeContainer}>{ timeLeft }</Text>}
        <ScrollView
          contentContainerStyle={gamePreviewStyles.container}
        >
          { Platform.OS === 'ios' && <KeepAwake /> }

          <ButtonBack
            onPress={handleBackFromChild}
          />

          <Text styles={[gamePreviewStyles.timeContainer, gamePreviewStyles.teamContainer]}>
            { `Team ${parseInt(teamRef.substring(4), 10) + 1}` }
          </Text>
          
          <View 
            style={[
              gamePreviewStyles.questionContainer,
              gamePreviewStyles.questionContainerTeacher,
            ]}
          >
            <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
            {Boolean(gameState[teamRef].image) &&
              <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} resizeMode={'contain'} />} 
          </View>
          <View style={gamePreviewStyles.choiceContainerWrapper}>
            <View style={gamePreviewStyles.choicesContainer}>
              {gameState[teamRef].choices.map(choice => (
                <Touchable
                  activeOpacity={0.8}
                  key={choice.uid}
                  onPress={() => {}}
                >
                  <View style={gamePreviewStyles.choiceContainer}>
                    <View style={[gamePreviewStyles.choiceButton]}>
                      {choice.selected &&
                        <View style={gamePreviewStyles.choiceButton} />}
                    </View>
                    <Text style={gamePreviewStyles.choiceValue}>{ choice.value }</Text>
                  </View>
                </Touchable>
              ))}
            </View>
          </View>
          {startedQuiz ?
            <ButtonWide
              label={'View results'}
              onPress={() => handleViewResults(teamRef)}
            />
            :
            <ButtonWide
              label={'Start quiz'}
              onPress={() => handleStartQuiz(teamRef)}
            />}
        </ScrollView>
      </View>
    );
  }
}
