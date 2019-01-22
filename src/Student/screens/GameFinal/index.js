import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Portal from '../../../screens/Portal';
import HeaderTeam from '../../components/HeaderTeam';
import ButtonWide from '../../../components/ButtonWide';
import gamePreviewStyles from '../GamePreview/styles';
import { colors, fonts } from '../../../utils/theme';
// import debug from '../../../utils/debug';


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
      portal: '',
      teamScore: 0,
    };

    this.mounted = false;
    this.startingGame = false;

    this.handleExitGame = this.handleExitGame.bind(this);
  }


  componentDidMount() {
    this.calculateTeamScore();
    this.mounted = true;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state) {
      if (nextProps.screenProps.gameState.state.newGame) {
        this.setState({ portal: 'Game is preparing...' });
      } else if (nextProps.screenProps.gameState.state.start) {
        this.startingGame = true;
        this.setState({ portal: '5' });
        setTimeout(() => this.mounted && this.setState({ portal: '4' }), 1000);
        setTimeout(() => this.mounted && this.setState({ portal: '3' }), 2000);
        setTimeout(() => this.mounted && this.setState({ portal: '2' }), 3000);
        setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
        setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
        setTimeout(() => this.mounted && this.setState({ portal: 'RightOn!' }), 5000);
        setTimeout(() => {
          this.startingGame = false;
          if (this.mounted) this.props.screenProps.navigation.navigate('GamePreview');
        }, 6000);
      }
    }
  }


  componentWillUnmount() {
    this.mounted = false;
    this.updateAccountScores();
  }


  updateAccountScores() {
    const { account, handleSetAppState } = this.props.screenProps;
    const { playerScore, teamScore } = this.state;
    const total = playerScore + teamScore;
    const updatedAccount = { ...account };
    updatedAccount.points = account.points + total;
    updatedAccount.gamesPlayed = account.gamesPlayed + 1;
    handleSetAppState('account', updatedAccount);
  }


  calculateTeamScore() {
    const { gameState, team } = this.props.screenProps;
    const choices = gameState[`team${team}`].choices || [];
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
      // Refrain from cleanup up `team` in state & unsubscribing from GameRoomID
      handleSetAppState('gameState', {});
    }, 500);
  }


  render() {
    const { team } = this.props.screenProps;
    const { playerScore, portal, teamScore } = this.state;

    if (portal) {
      return (
        <Portal
          messageType={'single'}
          messageValues={{ message: portal }} 
        />
      );
    }

    return (
      <View style={gamePreviewStyles.container}>
        <HeaderTeam team={`Team ${team + 1}`} />
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.centerAlign}>
              <Text style={styles.label}>Team Score</Text>            
              <Text style={styles.value}>{ teamScore }</Text>
            </View>
            <View style={styles.centerAlign}>
              <Text style={styles.label}>Your score</Text>            
              <Text style={styles.value}>{ playerScore }</Text>
            </View>
          </View>

          <View style={styles.centerAlign}>
            <Text style={styles.label}>Number of answers</Text>            
            <Text style={[styles.label, styles.italic]}>correct</Text>            
            <Text style={styles.value}>{ playerScore / 50 }</Text>
          </View>
          <View style={[styles.centerAlign, styles.marginTop]}>
            <Text style={styles.label}>Number of players</Text>
            <Text style={[styles.label, styles.italic]}>tricked</Text>            
            <Text style={styles.value}>{ (teamScore - playerScore) / 100 }</Text>
          </View>
        </View>

        <ButtonWide
          label={'Exit game'}
          onPress={this.handleExitGame}
        />
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  centerAlign: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  label: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  marginTop: {
    marginTop: '15@vs',
  },
  value: {
    color: colors.primary,
    fontSize: fonts.large,
    marginTop: '5@vs',
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '25@vs',
  },
});
