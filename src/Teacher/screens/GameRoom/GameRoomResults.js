import React from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons/FontAwesome';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import gamePreviewStyles from '../../../Student/screens/GamePreview/styles';
import { colors, deviceWidth } from '../../../utils/theme';

export default class GameRoomResults extends React.Component {
  static propTypes = {
    gameState: PropTypes.shape({}),
    handleBackFromChild: PropTypes.func.isRequired,
    handleNextQuiz: PropTypes.func.isRequired,
    numberOfPlayers: PropTypes.number.isRequired,
    teamRef: PropTypes.string.isRequired,
  };
  
  static defaultProps = {
    gameState: {},
    handleBackFromChild: () => {},
    handleNextQuiz: () => {},
    numberOfPlayers: 0,
    teamRef: 'team0',
  };

  constructor(props) {
    super(props);

    this.firstChoice = new Animated.Value(0);
    this.secondChoice = new Animated.Value(0);
    this.thirdChoice = new Animated.Value(0);
    this.fourthChoice = new Animated.Value(0);
  }
  

  componentDidMount() {
    setTimeout(() => this.startWidthAnimation(), 3500);
  }


  startWidthAnimation() {
    const { gameState, numberOfPlayers, teamRef } = this.props;
    const firstWidth = gameState[teamRef].choices[0] ?
      (gameState[teamRef].choices[0].votes / numberOfPlayers) *
      (deviceWidth - 30) : 0;
    const secondWidth = gameState[teamRef].choices[1] ?
      (gameState[teamRef].choices[1].votes / numberOfPlayers) *
      (deviceWidth - 30) : 0;
    const thirdWidth = gameState[teamRef].choices[2] ?
      (gameState[teamRef].choices[2].votes / numberOfPlayers) *
      (deviceWidth - 30) : 0;
    const fourthWidth = gameState[teamRef].choices[3] ?
      (gameState[teamRef].choices[3].votes / numberOfPlayers) *
      (deviceWidth - 30) : 0;

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
  }

  
  render() {
    const {
      gameState,
      handleBackFromChild,
      handleNextQuiz,
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
        <View style={gamePreviewStyles.questionContainer}>
          <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
          {Boolean(gameState[teamRef].image) &&
            <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} />} 
        </View>
        <View style={gamePreviewStyles.choiceContainerWrapper}>
          <View style={gamePreviewStyles.choicesContainer}>
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[0].correct ?
                <Aicon name={'check'} style={styles.checkmark} /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceAnswer}>{ choices[0].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.firstChoice }]} />
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[1].correct ?
                <Aicon name={'check'} style={styles.checkmark} /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceAnswer}>{ choices[1].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.secondChoice }]} />
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[2].correct ?
                <Aicon name={'check'} style={styles.checkmark} /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceAnswer}>{ choices[2].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.thirdChoice }]} />
            <View style={gamePreviewStyles.choiceContainer}>
              {choices[3].correct ?
                <Aicon name={'check'} style={styles.checkmark} /> :
                <View style={styles.hiddenDot} />
              }
              <Text style={gamePreviewStyles.choiceAnswer}>{ choices[3].value }</Text>
            </View>
            <Animated.View style={[styles.bar, { width: this.fourthChoice }]} />
          </View>
        </View>
        <ButtonWide
          label={'Next quiz'}
          onPress={() => handleNextQuiz()}
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
