import React from 'react';
import {
  Animated,
  findNodeHandle,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import NativeMethodsMixin from 'NativeMethodsMixin';
import PropTypes from 'prop-types';
import { scale, ScaledSheet } from 'react-native-size-matters';
// import Aicon from 'react-native-vector-icons/FontAwesome';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import gamePreviewStyles from '../../../Student/screens/GamePreview/styles';
import { colors, deviceWidth } from '../../../utils/theme';

export default class GameRoomResults extends React.Component {
  static propTypes = {
    gameState: PropTypes.shape({}),
    handleBackFromChild: PropTypes.func.isRequired,
    handleNextTeam: PropTypes.func.isRequired,
    nextTeam: PropTypes.string.isRequired,
    numberOfPlayers: PropTypes.number.isRequired,
    players: PropTypes.shape({}),
    teamRef: PropTypes.string.isRequired,
  };
  
  static defaultProps = {
    gameState: {},
    handleBackFromChild: () => {},
    handleNextTeam: () => {},
    nextTeam: '',
    numberOfPlayers: 0,
    players: {},
    teamRef: 'team0',
  };

  constructor(props) {
    super(props);

    this.firstChoice = new Animated.Value(0);
    this.secondChoice = new Animated.Value(0);
    this.thirdChoice = new Animated.Value(0);
    this.fourthChoice = new Animated.Value(0);

    this.choicesRef = undefined;
    this.choicesWidth = deviceWidth;

    this.handleChoicesRef = this.handleChoicesRef.bind(this);
    this.onChoicesLayout = this.onChoicesLayout.bind(this);
  }
  

  componentDidMount() {
    setTimeout(() => this.startWidthAnimation(), 3500);
  }


  onChoicesLayout() {
    if (this.choicesRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.choicesRef),
        (x) => {
          this.choicesWidth = deviceWidth - x - scale(55);
        }
      );
    }
  }


  handleChoicesRef(ref) {
    this.choicesRef = ref;
  }


  startWidthAnimation() {
    this.onChoicesLayout();
    setTimeout(() => {
      const { gameState, numberOfPlayers, players, teamRef } = this.props;
      const teamIdx = teamRef.substr(teamRef.indexOf('m') + 1);
      let playersInTeamRef = 0;
      const playerKeys = Object.keys(players);
      for (let i = 0; i < numberOfPlayers; i += 1) {
        if (players[playerKeys[i]] === `${teamIdx}`) {
          playersInTeamRef += 1;
        }
      }
      const firstWidth = gameState[teamRef].choices[0] ?
        (gameState[teamRef].choices[0].votes / (numberOfPlayers - playersInTeamRef)) *
        this.choicesWidth : 0;
      const secondWidth = gameState[teamRef].choices[1] ?
        (gameState[teamRef].choices[1].votes / (numberOfPlayers - playersInTeamRef)) *
        this.choicesWidth : 0;
      const thirdWidth = gameState[teamRef].choices[2] ?
        (gameState[teamRef].choices[2].votes / (numberOfPlayers - playersInTeamRef)) *
        this.choicesWidth : 0;
      const fourthWidth = gameState[teamRef].choices[3] ?
        (gameState[teamRef].choices[3].votes / (numberOfPlayers - playersInTeamRef)) *
        this.choicesWidth : 0;
  
      Animated.parallel([
        Animated.timing(
          this.firstChoice, {
            toValue: firstWidth,
            duration: 2000,
          }
        ),
        Animated.timing(
          this.secondChoice, {
            toValue: secondWidth,
            duration: 2000,
          }
        ),
        Animated.timing(
          this.thirdChoice, {
            toValue: thirdWidth,
            duration: 2000,
          }
        ),
        Animated.timing(
          this.fourthChoice, {
            toValue: fourthWidth,
            duration: 2000,
          }
        ),
      ],
      { useNativeDriver: true }).start();
    }, 100);
  }

  
  render() {
    const {
      gameState,
      handleBackFromChild,
      handleNextTeam,
      nextTeam,
      teamRef,
    } = this.props;

    const { choices } = gameState[teamRef]; 

    return (
      <ScrollView
        contentContainerStyle={gamePreviewStyles.container}
      >
        <ButtonBack
          onPress={handleBackFromChild}
        />
        <View 
          style={[gamePreviewStyles.questionContainer, gamePreviewStyles.questionContainerTeacher]}
        >
          <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
          {Boolean(gameState[teamRef].image) &&
            <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} />} 
        </View>
        <View
          onLayout={this.onChoicesLayout}
          ref={this.handleChoicesRef}
          style={gamePreviewStyles.choiceContainerWrapper}
        >
          <View style={gamePreviewStyles.choicesContainer}>
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[0] && choices[0].correct ?
                <View
                  style={[gamePreviewStyles.choiceButton, gamePreviewStyles.choiceSelected]}
                /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[0] && choices[0].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.firstChoice }]} />
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[1] && choices[1].correct ?
                <View
                  style={[gamePreviewStyles.choiceButton, gamePreviewStyles.choiceSelected]}
                /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[1] && choices[1].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.secondChoice }]} />
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[2] && choices[2].correct ?
                <View
                  style={[gamePreviewStyles.choiceButton, gamePreviewStyles.choiceSelected]}
                /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[2] && choices[2].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.thirdChoice }]} />
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[3] && choices[3].correct ?
                <View
                  style={[gamePreviewStyles.choiceButton, gamePreviewStyles.choiceSelected]}
                /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[3] && choices[3].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.fourthChoice }]} />
          </View>
        </View>
        <ButtonWide
          label={nextTeam ? `Next: Team ${nextTeam.substr(4)}'s Question` : 'Final results'}
          onPress={() => handleNextTeam()}
        />
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  bar: {
    backgroundColor: colors.primary,
    height: '30@vs',
    marginLeft: '55@s',
  },
  hiddenDot: {
    height: '25@s',
    marginHorizontal: '15@s',
    width: '25@s',
  },
  checkmark: {
    color: colors.primary,
    fontSize: '25@ms0.2',
    marginBottom: '10@vs',
    marginHorizontal: '15@s',
  },
});
