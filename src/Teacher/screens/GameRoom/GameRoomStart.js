import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonWide from '../../../components/ButtonWide';
import styles from './styles';

export default function GameRoomStart({ gameState, handleStartGame, players, teams }) {
  return (
    <ScrollView
      contentContainerStyle={styles.dashboardContainer}
    >
      <View style={styles.playersContainer}>
        <Text style={[styles.textLabel, styles.textLarge]}>{ Object.keys(players).length }</Text>
        <Text style={styles.textLabel}>Players</Text>
      </View>
      <View style={styles.teamsContainer}>
        {teams.map((val, idx) => (
          <View key={`${Math.random()}`} style={styles.playersContainer}>
            <Text style={[styles.textLabel, styles.textLarge]}>{ val }</Text>
            <Text style={styles.textLabel}>{ `Team ${idx + 1}` }</Text>
          </View>
        ))}
      </View>
      {!gameState.start &&
        <ButtonWide
          label={'Start Game'}
          onPress={handleStartGame}
        />}
    </ScrollView>
  );
}

GameRoomStart.propTypes = {
  gameState: PropTypes.shape({}),
  handleStartGame: PropTypes.func.isRequired,
  players: PropTypes.shape({}),
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomStart.defaultProps = {
  gameState: {},
  handleStartGame: () => {},
  players: {},
  teams: [],
};
