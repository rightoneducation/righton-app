import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import styles from './styles';

export default function GameRoomStart({
  gameState,
  handleEndGame,
  handleStartGame,
  players,
  teams
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.dashboardContainer}
    >
      <ButtonBack
        iconName={'close'}
        onPress={handleEndGame}
      />
      <Text style={[styles.textLabel, styles.textLarge, styles.alignRight]}>
        { gameState.GameRoomID }
      </Text>
      <View style={styles.playersContainer}>
        <Text style={[styles.textLabel, styles.textLarge]}>{ Object.keys(players).length }</Text>
        <Text style={styles.textLabel}>Players in game room</Text>
      </View>
      <View style={styles.teamsContainer}>
        {teams.map((val, idx) => (
          <View key={`${Math.random()}`} style={styles.teamContainer}>
            <Text style={styles.textLabel}>{ `Team ${idx + 1}` }</Text>
            <Text style={[styles.textLabel, styles.textLarge]}>{ val === 1 ? '1 player' : `${val} players` }</Text>
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
  handleEndGame: PropTypes.func.isRequired,
  handleStartGame: PropTypes.func.isRequired,
  players: PropTypes.shape({}),
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomStart.defaultProps = {
  gameState: {},
  handleEndGame: () => {},
  handleStartGame: () => {},
  players: {},
  teams: [],
};
