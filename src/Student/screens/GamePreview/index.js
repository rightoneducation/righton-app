import React from 'react';
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import HeaderTeam from '../../components/HeaderTeam';
import styles from './styles';


export default class GamePreview extends React.PureComponent {
  static propTypes = {
    gameState: PropTypes.shape({
      type: PropTypes.any,
    }),
    group: PropTypes.number.isRequired,
    studentAppNavigator: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }
  
  static defaultProps = {
    gameState: {},
    group: 0,
    studentAppNavigator: {},
  }

  constructor(props) {
    super(props);

    this.animatedArrow1 = new Animated.Value(0);
    this.animatedArrow2 = new Animated.Value(0);
    this.animatedArrow3 = new Animated.Value(0);

    this.state = {
      showInstructions: false,
    };
  }


  componentDidMount() {
    this.startArrowAnimation();
  }


  startArrowAnimation() {
    Animated.parallel([
      Animated.timing(
        this.animatedArrow1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        this.animatedArrow2, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        this.animatedArrow3, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }
      ),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(
          this.animatedArrow1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          this.animatedArrow2, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          this.animatedArrow3, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }
        ),
      ]).start();
    }, 500);
  }


  renderArrowButton = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {}}
      style={styles.arrowButton}
    >
      <Animated.View style={[styles.arrow, styles.arrow1, { opacity: this.animatedArrow1 }]} />
      <Animated.View style={[styles.arrow, styles.arrow2, { opacity: this.animatedArrow2 }]} />
      <Animated.View style={[styles.arrow, styles.arrow3, { opacity: this.animatedArrow3 }]} />
    </TouchableOpacity>
  )


  renderQuestion() {
    const { gameState, group } = this.props;
    const team = `team${group}`;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{ gameState[team].question }</Text>
        {gameState[team].image &&
          <Image source={{ uri: gameState[team].image }} style={styles.image} />} 
      </View>
    );
  }


  render() {
    const { gameState, group } = this.props;
    const team = `team${group}`;

    return (
      <View style={styles.container}>
        <HeaderTeam team={gameState[team].team} />
        { this.renderQuestion() }
        { this.renderArrowButton() }
      </View>
    );
  }
}
