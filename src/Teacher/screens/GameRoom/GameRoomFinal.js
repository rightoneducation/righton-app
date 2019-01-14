import React from 'react';
import {
  // Animated,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { scale, ScaledSheet, verticalScale } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons/FontAwesome';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import parentStyles from './styles';
import { colors, deviceWidth } from '../../../utils/theme';

export default class GameRoomFinal extends React.Component {
  static propTypes = {
    gameState: PropTypes.shape({}),
    handleBackFromChild: PropTypes.func.isRequired,
    handleEndGame: PropTypes.func.isRequired,
    handleRenderNewGame: PropTypes.func.isRequired,
    numberOfPlayers: PropTypes.number.isRequired,
  };
  
  static defaultProps = {
    gameState: {},
    handleBackFromChild: () => {},
    handleEndGame: () => {},
    handleRenderNewGame: () => {},
    numberOfPlayers: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      rankedTeams: [],
    };
  }


  componentDidMount() {
    this.setRankedTeams();
  }


  setRankedTeams() {
    const { gameState } = this.props;
    const rankedTeamsAux = [];
    const gameStateKeys = Object.keys(gameState);
    for (let i = 0; i < gameStateKeys.length; i += 1) {
      if (gameStateKeys[i].includes('team')) {
        const teamRef = gameStateKeys[i];
        if (gameState[teamRef].choices.length) {
          const choices = gameState[teamRef].choices;
          const teamRank = {};
          let bestTrickValue = '';
          let bestTrickCount = 0;
          let totalTricks = 0;
          for (let j = 0; j < choices.length; j += 1) {
            if (choices[j].correct === undefined) {
              totalTricks += choices[j].votes;
              if (choices[j].votes > bestTrickCount) {
                bestTrickValue = choices[j].value;
                bestTrickCount = choices[j].votes;
              }
            }
          }
          const teamNumber = parseInt(teamRef.substr(teamRef.indexOf('m') + 1), 10) + 1;
          const teamPoints = gameState[teamRef].points;
          teamRank.team = `Team ${teamNumber}`;
          teamRank.bestTrickValue = bestTrickValue;
          teamRank.bestTrickCount = bestTrickCount;
          teamRank.totalTricks = totalTricks;
          teamRank.totalPoints = (totalTricks * 100) + teamPoints;
          teamRank.uid = `${Math.random()}`;
          // Include a `correctPoints` count in `team#` for additional adjustment TODO
          rankedTeamsAux.push(teamRank);
        }
      }
    }
    const rankedTeams = this.sortRankedTeams(rankedTeamsAux);
    this.setState({ rankedTeams });
  }


  sortRankedTeams = (teamsAux) => {
    const teams = [...teamsAux];
    const length = teamsAux.length;
    const rankedTeams = [];
    while (rankedTeams.length !== length) {
      const highestRank = { index: 0, totalPoints: 0 };
      for (let i = 0; i < teams.length; i += 1) {
        if (teams[i].totalPoints >= highestRank.totalPoints) {
          highestRank.index = i;
          highestRank.totalPoints = teams[i].totalPoints;
        }
      }
      rankedTeams.push(teams.splice(highestRank.index, 1)[0]);
    }
    return rankedTeams;
  }


  renderTeam = (team, players) => (
    <View key={team.uid} style={styles.teamContainer}>
      <Text style={[parentStyles.textLabel, parentStyles.textLarge, styles.primary]}>
        { team.team }
      </Text>
      <Text style={parentStyles.textLabel}>Total points:</Text>
      <Text style={[parentStyles.textLabel, styles.primary]}>{ team.totalPoints }</Text>
      <Text style={parentStyles.textLabel}>Best trick:</Text>
      <Text style={[parentStyles.textLabel, styles.primary]}>{ team.bestTrickValue }</Text>
      <Text style={parentStyles.textLabel}>Number of players tricked:</Text>
      <View style={styles.teamItemRow}>
        <Text style={[parentStyles.textLabel, styles.primary]}>{ team.bestTrickCount }</Text>
        <Text style={[parentStyles.textLabel, styles.primary]}>{ `${Math.round((team.bestTrickCount * players) * 100)}%` }</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );

  
  render() {
    const {
      gameState,
      handleBackFromChild,
      handleEndGame,
      handleRenderNewGame,
      numberOfPlayers,
    } = this.props;

    const { rankedTeams } = this.state;

    return (
      <ScrollView
        contentContainerStyle={[
          parentStyles.dashboardContainer,
          styles.alignCenter,
          styles.extraPaddingBottom,
        ]}
      >
        <ButtonBack
          onPress={handleBackFromChild}
        />

        <Text 
          style={[
            parentStyles.textLabel,
            parentStyles.textLarge,
            parentStyles.textCenter,
            parentStyles.extraMarginBottom,
            styles.primary,
          ]}
        >
          { gameState.GameRoomID }
        </Text>
        
        {rankedTeams.length > 0 &&
          <Aicon name={'trophy'} style={styles.trophy} />}

        {rankedTeams.map(team => this.renderTeam(team, numberOfPlayers))}

        <ButtonWide
          buttonStyles={{
            backgroundColor: colors.dark,
            borderColor: colors.primary,
            borderWidth: 1,
            bottom: verticalScale(95),
          }}
          label={'New game'}
          onPress={handleRenderNewGame}
        />

        <ButtonWide
          label={'End game'}
          onPress={handleEndGame}
        />
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  alignCenter: {
    alignItems: 'center',
  },
  divider: {
    backgroundColor: colors.white,
    height: 1,
    marginTop: '15@vs',
    marginBottom: '25@vs',
    opacity: 0.5,
    width: deviceWidth - scale(100),
  },
  extraPaddingBottom: {
    paddingBottom: '175@vs',
  },
  primary: {
    color: colors.primary,
  },
  teamContainer: {
    alignItems: 'center',
  },
  teamItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: deviceWidth - scale(100),
  },
  trophy: {
    color: 'gold',
    fontSize: '65@ms0.2',
    marginBottom: '15@vs',
  },
});
