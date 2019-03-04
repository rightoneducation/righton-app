import React from 'react';
import {
  Platform,
  Text,
  View,
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { ScaledSheet } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import Portal from '../../../screens/Portal';
import HeaderTeam from '../../components/HeaderTeam';
import ButtonWide from '../../../components/ButtonWide';
import gamePreviewStyles from '../GamePreview/styles';
import { colors, fonts } from '../../../utils/theme';
// import debug from '../../../utils/debug';
import { handleExitGame } from '../../../utils/studentGameUtils';


export default class GameFinal extends React.Component {
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
      exit: false,
      playerScore: props.screenProps.points,
      portal: '',
      teamScore: 0,
      totalTricks: 0,
    };

    this.mounted = false;
    this.startingGame = false;
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
      } else if (nextProps.screenProps.gameState.state.exitGame) {
        this.setState({ exit: true });
      }
    }
  }


  componentWillUnmount() {
    this.mounted = false;
  }


  handleExitGame = () => {
    const { handleSetAppState, IOTUnsubscribeFromTopic } = this.props.screenProps;
    const { navigation } = this.props;
    handleExitGame(handleSetAppState, IOTUnsubscribeFromTopic, navigation);
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
    const teamRef = `team${team}`;
    const choices = gameState[teamRef].choices || [];
    const { players } = gameState.state;
    const playerKeys = Object.keys(players);
    const numberOfPlayers = playerKeys.length;
    let numberOfTeammates = 0;
    for (let i = 0; i < numberOfPlayers; i += 1) {
      if (players[playerKeys[i]] === team) numberOfTeammates += 1;
    }
    let trickCount = 0;
    for (let i = 0; i < choices.length; i += 1) {
      if (!choices[i].correct) {
        trickCount += choices[i].votes;
      }
    }
    trickCount += numberOfPlayers - numberOfTeammates - trickCount;
    const teamScore = Math.round((trickCount / (numberOfPlayers - numberOfTeammates)) * 100) || 0;
    this.setState({ teamScore, totalTricks: trickCount }, () => {
      this.updateAccountScores();
    });
  }


  render() {
    const { team } = this.props.screenProps;
    const { exit, playerScore, portal, teamScore, totalTricks } = this.state;

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
        { Platform.OS === 'ios' && <KeepAwake /> }

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
            <Text style={styles.value}>{ playerScore / 25 }</Text>
          </View>
          <View style={[styles.centerAlign, styles.marginTop]}>
            <Text style={styles.label}>Number of players</Text>
            <Text style={[styles.label, styles.italic]}>tricked</Text>            
            <Text style={styles.value}>{ totalTricks }</Text>
          </View>
        </View>

        {exit &&
          <ButtonWide
            label={'Exit game'}
            onPress={this.handleExitGame}
          />}
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
    alignSelf: 'stretch',
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
    marginBottom: '35@vs',
  },
});
