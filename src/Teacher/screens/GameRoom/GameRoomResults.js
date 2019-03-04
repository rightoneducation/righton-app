import React from 'react';
import {
  Animated,
  findNodeHandle,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import NativeMethodsMixin from 'NativeMethodsMixin';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons/FontAwesome';
import KeepAwake from 'react-native-keep-awake';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import gamePreviewStyles from '../../../Student/screens/GamePreview/styles';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default class GameRoomResults extends React.Component {
  static propTypes = {
    gameState: gameStatePropTypes,
    handleBackFromChild: PropTypes.func.isRequired,
    handleNextTeam: PropTypes.func.isRequired,
    nextTeam: PropTypes.string.isRequired,
    numberOfPlayers: PropTypes.number.isRequired,
    players: PropTypes.shape({}),
    teamRef: PropTypes.string.isRequired,
  };
  
  static defaultProps = {
    gameState: gameStateDefaultProps,
    handleBackFromChild: () => {},
    handleNextTeam: () => {},
    nextTeam: '',
    numberOfPlayers: 0,
    players: {},
    teamRef: 'team0',
  };

  constructor(props) {
    super(props);

    this.state = {
      firstPercent: 0,
      secondPercent: 0,
      thirdPercent: 0,
      fourthPercent: 0,
      noAnswerPercent: 0,
    };

    this.firstChoice = new Animated.Value(0);
    this.secondChoice = new Animated.Value(0);
    this.thirdChoice = new Animated.Value(0);
    this.fourthChoice = new Animated.Value(0);
    this.noAnswer = new Animated.Value(0);
    this.percentOpacity = new Animated.Value(0);

    this.choicesRef = undefined;
    this.choicesWidth = deviceWidth;
    this.mounted = undefined;
  }
  

  componentDidMount() {
    setTimeout(() => this.startWidthAnimation(), 3500);
    this.mounted = true;
  }


  componentWillUnmount() {
    this.mounted = false;
  }


  onChoicesLayout = () => {
    if (this.choicesRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.choicesRef),
        (x) => {
          this.choicesWidth = deviceWidth - x - moderateScale(45);
        }
      );
    }
  }


  handleChoicesRef = (ref) => {
    this.choicesRef = ref;
  }


  startWidthAnimation() {
    if (!this.mounted) return;
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
      const playersWhoVoted = numberOfPlayers - playersInTeamRef;
      let noAnswerCount = playersWhoVoted;

      let firstWidth = 0;
      let secondWidth = 0;
      let thirdWidth = 0;
      let fourthWidth = 0;
      let noAnswerWidth = 0;

      let firstPercent = 0;
      let secondPercent = 0;
      let thirdPercent = 0;
      let fourthPercent = 0;
      let noAnswerPercent = 0;


      if (gameState[teamRef].choices[0]) {
        const votes = gameState[teamRef].choices[0].votes;
        const fraction = votes / playersWhoVoted;
        firstWidth = fraction * this.choicesWidth;
        firstPercent = Math.round(fraction * 100);
        noAnswerCount -= votes;
      }
      if (gameState[teamRef].choices[1]) {
        const votes = gameState[teamRef].choices[1].votes;
        const fraction = votes / playersWhoVoted;
        secondWidth = fraction * this.choicesWidth;
        secondPercent = Math.round(fraction * 100);
        noAnswerCount -= votes;
      }
      if (gameState[teamRef].choices[2]) {
        const votes = gameState[teamRef].choices[2].votes;
        const fraction = votes / playersWhoVoted;
        thirdWidth = fraction * this.choicesWidth;
        thirdPercent = Math.round(fraction * 100);
        noAnswerCount -= votes;
      }
      if (gameState[teamRef].choices[3]) {
        const votes = gameState[teamRef].choices[3].votes;
        const fraction = votes / playersWhoVoted;
        fourthWidth = fraction * this.choicesWidth;
        fourthPercent = Math.round(fraction * 100);
        noAnswerCount -= votes;
      }
      if (noAnswerCount) {
        noAnswerWidth = (noAnswerCount / playersWhoVoted) * this.choicesWidth;
        noAnswerPercent = (noAnswerCount / playersWhoVoted) * 100;
        if (this.mounted) this.setState({ noAnswerPercent }); 
        // TODO Delay rendering the actual percentage with the rest
      }
  
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
        Animated.timing(
          this.noAnswer, {
            toValue: noAnswerWidth,
            duration: 2000,
          }
        ),
        Animated.timing(
          this.percentOpacity, {
            toValue: 1,
            duration: 2000,
          }
        ),
      ],
      { useNativeDriver: true }).start(() => {
        if (this.mounted) {
          this.setState({
            firstPercent,
            secondPercent,
            thirdPercent,
            fourthPercent,
          });
        }
      });
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

    const {
      firstPercent,
      secondPercent,
      thirdPercent,
      fourthPercent,
      noAnswerPercent,
    } = this.state;

    return (
      <ScrollView
        contentContainerStyle={gamePreviewStyles.container}
      >
        { Platform.OS === 'ios' && <KeepAwake /> }

        <ButtonBack
          onPress={handleBackFromChild}
        />
        <View 
          style={[gamePreviewStyles.questionContainer, gamePreviewStyles.questionContainerTeacher]}
        >
          <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
          {Boolean(gameState[teamRef].image) &&
            <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} resizeMode={'contain'} />} 
        </View>
        <View
          onLayout={this.onChoicesLayout}
          ref={this.handleChoicesRef}
          style={gamePreviewStyles.choiceContainerWrapper}
        >
          <View style={gamePreviewStyles.choicesContainer}>

            <View style={gamePreviewStyles.choiceContainer}>
              {choices[0] && choices[0].correct ?
                <Aicon name={'check'} style={styles.check} /> :
                <View style={[gamePreviewStyles.choiceButton, styles.hiddenDot]} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[0] && choices[0].value }</Text>
            </View>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar, 
                { width: this.firstChoice, opacity: this.percentOpacity }]}
              />
              <Text style={[styles.percent, firstPercent && styles.visible]}>
                { firstPercent ? `${firstPercent}%` : '100%' }
              </Text>
            </View>

            <View style={gamePreviewStyles.choiceContainer}>
              {choices[1] && choices[1].correct ?
                <Aicon name={'check'} style={styles.check} /> :
                <View style={[gamePreviewStyles.choiceButton, styles.hiddenDot]} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[1] && choices[1].value }</Text>
            </View>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar, 
                { width: this.secondChoice, opacity: this.percentOpacity }]}
              />
              <Text style={[styles.percent, secondPercent && styles.visible]}>
                { secondPercent ? `${secondPercent}%` : '100%' }
              </Text>
            </View>

            <View style={gamePreviewStyles.choiceContainer}>
              {choices[2] && choices[2].correct ?
                <Aicon name={'check'} style={styles.check} /> :
                <View style={[gamePreviewStyles.choiceButton, styles.hiddenDot]} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[2] && choices[2].value }</Text>
            </View>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar, 
                { width: this.thirdChoice, opacity: this.percentOpacity }]}
              />
              <Text style={[styles.percent, thirdPercent && styles.visible]}>
                { thirdPercent ? `${thirdPercent}%` : '100%' }
              </Text>
            </View>

            <View style={gamePreviewStyles.choiceContainer}>
              {choices[3] && choices[3].correct ?
                <Aicon name={'check'} style={styles.check} /> :
                <View style={[gamePreviewStyles.choiceButton, styles.hiddenDot]} />
              }
              <Text style={gamePreviewStyles.choiceValue}>{ choices[3] && choices[3].value }</Text>
            </View>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar, 
                { width: this.fourthChoice, opacity: this.percentOpacity }]}
              />
              <Text style={[styles.percent, fourthPercent && styles.visible]}>
                { fourthPercent ? `${fourthPercent}%` : '100%' }
              </Text>
            </View>

            {Boolean(noAnswerPercent) &&
              <View style={gamePreviewStyles.choiceContainer}>
                <View style={[gamePreviewStyles.choiceButton, styles.hiddenDot]} />
                <Text style={gamePreviewStyles.choiceValue}>No answer</Text>
              </View>}
            {Boolean(noAnswerPercent) &&
              <View style={styles.barContainer}>
                <Animated.View style={[styles.bar, 
                  { width: this.noAnswer, opacity: this.percentOpacity }]}
                />
                <Text style={[styles.percent, noAnswerPercent && styles.visible]}>
                  { noAnswerPercent ? `${noAnswerPercent}%` : '100%' }
                </Text>
              </View>}

          </View>
        </View>
        <ButtonWide
          label={nextTeam ? `Next: Team ${parseInt(nextTeam.substr(4), 10) + 1}'s Question` : 'Final results'}
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
  },
  barContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: '45@ms',
  },
  check: {
    color: colors.primary,
    fontSize: '15@ms',
    marginHorizontal: '15@ms',
  },
  hiddenDot: {
    borderColor: colors.darkGray,
  },
  percent: {
    color: colors.darkGray,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    marginLeft: '5@ms',
  },
  visible: {
    color: colors.white,
  },
});
