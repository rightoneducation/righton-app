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
import Instructions from '../../../components/Instructions';
import styles from './styles';


export default class GamePreview extends React.PureComponent {
  static propTypes = {
    gameState: PropTypes.shape({
      team0: PropTypes.shape({
        instructions: PropTypes.array,
        question: PropTypes.string,
        team: PropTypes.string,
      }),
    }),
    group: PropTypes.number.isRequired,
    studentAppNavigator: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }
  
  static defaultProps = {
    gameState: {
      team0: {
        instructions: __DEV__ ? ['Look up and to the right', 'Touch your tongue', 'Smack your lips'] : [],
        question: __DEV__ ? 'What did you eat for breakfast?' : '',
        team: __DEV__ ? "The Catcher's Rye" : '',
      },
    },
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

    this.toggleInstructions = this.toggleInstructions.bind(this);
  }


  componentDidMount() {
    this.startAnimation();
  }


  componentWillUnmount() {
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
    const { showInstructions } = this.state;

    const { gameState, group } = this.props;
    const team = `team${group}`;

    return (
      <View style={styles.container}>
        <HeaderTeam team={gameState[team].team} />
        {this.renderQuestion()}
        {!showInstructions && this.renderArrowButton()}
        {showInstructions &&
          <Instructions
            handleCloseModal={this.toggleInstructions}
            data={gameState[team].instructions}
            visible={showInstructions}
          />}
      </View>
    );
  }
}
