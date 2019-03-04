import React from 'react';
import {
  // Animated,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import { scale, ScaledSheet, verticalScale } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import { getQuizFromDynamoDB, putQuizInDynamoDB } from '../../../../lib/Categories/DynamoDB/QuizMakerAPI';
import Aicon from 'react-native-vector-icons/FontAwesome';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import parentStyles from './styles';
import { colors, deviceWidth } from '../../../utils/theme';
import debug from '../../../utils/debug';


export default class GameRoomFinal extends React.Component {
  static propTypes = {
    gameState: gameStatePropTypes,
    handleBackFromChild: PropTypes.func.isRequired,
    handleEndGame: PropTypes.func.isRequired,
    handleRenderNewGame: PropTypes.func.isRequired,
    numberOfPlayers: PropTypes.number.isRequired,
    players: PropTypes.shape({}),
  };
  
  static defaultProps = {
    gameState: gameStateDefaultProps,
    handleBackFromChild: () => {},
    handleEndGame: () => {},
    handleRenderNewGame: () => {},
    numberOfPlayers: 0,
    players: {},
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
    const { gameState, numberOfPlayers } = this.props;
    const rankedTeamsAux = [];
    const gameStateKeys = Object.keys(gameState);
    for (let i = 0; i < gameStateKeys.length; i += 1) {
      if (gameStateKeys[i].includes('team')) {
        const teamRef = gameStateKeys[i];
        if (gameState[teamRef].choices.length) {
          const choices = gameState[teamRef].choices;
          const teamRank = {};
          let bestTrickValue = '';
          let bestTrickVotes = 0;
          let correctVotes = 0;
          for (let j = 0; j < choices.length; j += 1) {
            if (choices[j].correct === undefined) {
              if (choices[j].votes > bestTrickVotes) {
                bestTrickValue = choices[j].value;
                bestTrickVotes = choices[j].votes;
              }
            } else {
              correctVotes += choices[j].votes;
            }
          }
          // TODO Remove teamPoints - or include it into `totalPoints`?? 
          const teamNumber = teamRef.substr(teamRef.indexOf('m') + 1);
          const playersInTeam = this.calculatePlayersInTeam(teamNumber);
          const totalTricks = (numberOfPlayers - playersInTeam - correctVotes) || 0;
          teamRank.playersInTeam = playersInTeam;
          teamRank.answer = gameState[teamRef].answer;
          teamRank.team = `Team ${parseInt(teamNumber, 10) + 1}`;
          teamRank.bestTrickValue = bestTrickValue || '';
          teamRank.bestTrickVotes = bestTrickVotes || 0;
          teamRank.totalTricks = totalTricks || 0;
          teamRank.totalPoints = 
            Math.round((totalTricks / (numberOfPlayers - playersInTeam)) * 100) || 0;
          teamRank.uid = `${Math.random()}`;
          rankedTeamsAux.push(teamRank);
        }
      }
    }
    const rankedTeams = this.sortRankedTeams(rankedTeamsAux);
    this.setState({ rankedTeams },
      () => this.updateGameInQuizMaker()
    );
  }


  calculatePlayersInTeam(teamNumber) {
    const { numberOfPlayers, players } = this.props;
    let numberOfTeammates = 0;
    const playerKeys = Object.keys(players);
    for (let i = 0; i < numberOfPlayers; i += 1) {
      if (players[playerKeys[i]] === teamNumber) {
        numberOfTeammates += 1;
      }
    }
    // debug.log('calculatePlayersInTeam()');
    // debug.log('players:', players);
    // debug.log('playerKeys:', playerKeys);
    // debug.log('teamNumber:', teamNumber);
    // debug.log('numberOfTeammates:', numberOfTeammates);
    return numberOfTeammates;
  }


  updateGameInQuizMaker() {
    const { gameState } = this.props;
    if (gameState.quizmaker) {
      const { rankedTeams } = this.state;
      getQuizFromDynamoDB(
        gameState.GameID,
        (res) => {
          if (typeof res === 'object' && res.GameID === gameState.GameID) {
            // Update the Quiz w/ the details of this game.
            const updatedQuiz = { ...res };
            const keys = Object.keys(updatedQuiz);
            updatedQuiz.played += 1;


            for (let i = 0; i < rankedTeams.length; i += 1) {
              const answer = rankedTeams[i].answer;
              for (let j = 0; j < keys.length; j += 1) {
                if (typeof updatedQuiz[j] === 'object' && updatedQuiz[j].answer === answer) {
                  // TODO Check whether we want to refrain from pushing it votes
                  // is less than a specified amount.
                  updatedQuiz[j].tricks.push({
                    votes: rankedTeams[i].bestTrickVotes,
                    value: rankedTeams[i].bestTrickValue,
                  });
                  break;
                }
              }
            }

            putQuizInDynamoDB(
              updatedQuiz,
              response => debug.log('Successfully PUT quiz in QuizMaker', response),
              exception => debug.warn('Error PUTTING quiz in QuizMaker', exception),
            );
          } 
        },
        exception => debug.log('Error GETTING quiz from QuizMaker in DynamoDB', JSON.stringify(exception))
      );
    }
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


  renderTeam = (team, numberOfPlayers) => (
    <View key={team.uid} style={styles.teamContainer}>
      <Text style={[parentStyles.textLabel, parentStyles.textLarge, styles.primary]}>
        { team.team }
      </Text>
      <Text style={parentStyles.textLabel}>Total points:</Text>
      <Text style={[parentStyles.textLabel, styles.primary]}>{ team.totalPoints }</Text>
      <Text style={parentStyles.textLabel}>Best trick answer:</Text>
      <Text style={[parentStyles.textLabel, styles.primary]}>{ team.bestTrickValue }</Text>
      <Text style={parentStyles.textLabel}>Players tricked:</Text>
      <View style={styles.teamItemRow}>
        <Text style={[parentStyles.textLabel, styles.primary]}>{ team.totalTricks }</Text>
        <Text style={[parentStyles.textLabel, styles.primary]}>{ `${Math.round((team.totalTricks / (numberOfPlayers - team.playersInTeam)) * 100) || 0}%` }</Text>
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

    const {
      rankedTeams,
    } = this.state;

    return (
      <ScrollView
        contentContainerStyle={[
          parentStyles.dashboardContainer,
          styles.alignCenter,
          styles.extraPaddingBottom,
        ]}
      >
        { Platform.OS === 'ios' && <KeepAwake /> }

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
