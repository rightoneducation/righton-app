import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import HeaderTeam from '../../components/HeaderTeam';
import ButtonWide from '../../../components/ButtonWide';
import gamePreviewStyles from '../GamePreview/styles';
// import { colors } from '../../../utils/theme';

export default class GameFinal extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({}),
      handleSetAppState: PropTypes.func.isRequired,
      team: PropTypes.number,
    }),
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }),
  }

  static defaultProps = {
    screenProps: {
      gameState: {},
      handleSetAppState: () => {},
      team: 0,
    },
    navigation: {
      navigate: () => {},
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      playerScore: props.screenProps.points,
      teamScore: 0,
    };

    this.handleExitGame = this.handleExitGame.bind(this);
  }


  componentDidMount() {
    this.calculateTeamScore();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      if (nextProps.screenProps.gameState.state.newGame) {
        this.props.navigation.navigate('GamePreview');
      }
    }
  }


  calculateTeamScore() {
    const { gameState, team } = this.props.screenProps;
    const choices = gameState[`team${team}`].choices;
    let trickCount = 0;
    for (let i = 0; i < choices.length; i += 1) {
      if (!choices[i].correct) {
        trickCount += choices[i].votes;
      }
    }
    const teamScore = trickCount * 100;
    this.setState({ teamScore });
  }


  handleExitGame() {
    const { handleSetAppState } = this.props.screenProps;
    this.props.navigation.navigate('Dashboard');
    setTimeout(() => {
      // Refrain from cleanup up `team` in state & unsubscribing from gameroom
      handleSetAppState('gameState', {});
    }, 500);
  }


  render() {
    const { team } = this.props.screenProps;
    const { playerScore, teamScore } = this.state;

    return (
      <View style={gamePreviewStyles.container}>
        <HeaderTeam team={`Team ${team + 1}`} />
        <View>
          <Text>{ teamScore }</Text>
          <Text>{ playerScore }</Text>
        </View>
        <ButtonWide
          label={'Exit game'}
          onPress={this.handleExitGame}
        />
      </View>
    );
  }
}
