import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import styles from './styles';

export default function GameRoomOverview({ gameState, handleGamePreview, teams }) {
  const gameKeys = typeof gameState === 'object' ? Object.keys(gameState) : [];
  return (
    <ScrollView
      contentContainerStyle={styles.dashboardContainer}
    >
      <Text style={[styles.textLabel, styles.textLarge, styles.textCenter]}>
        Game Room: { gameState.GameRoomID }
      </Text>
      {gameKeys.map((key) => {
        if (!key.includes('team')) return null;
        const teamIdx = parseInt(key.substr(4), 10);
        return (
          key.includes('team') &&
            <Touchable
              activeOpacity={0.8}
              key={gameState[key].uid}
              onPress={() => handleGamePreview(`team${teamIdx}`)}
            >
              <View style={styles.gameContainer}>
                <Text style={styles.textLabel}>{ `Team ${teamIdx + 1}` }</Text>
                <Text style={styles.textLabel}>{ `${teams[teamIdx]} players` }</Text>
                <Text style={styles.textLabel}>Question:</Text>
                <Text style={styles.textLabel}>{ gameState[key].question }</Text>
                <Text style={styles.textLabel}>Tricks:</Text>
                <Text style={styles.textLabel}>a. { gameState[key].tricks[0] }</Text>
                <Text style={styles.textLabel}>b. { gameState[key].tricks[1] }</Text>
                <Text style={styles.textLabel}>c. { gameState[key].tricks[2] }</Text>
              </View>
            </Touchable>
        );
      })}
    </ScrollView>
  );
}

GameRoomOverview.propTypes = {
  gameState: PropTypes.shape({}),
  handleGamePreview: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomOverview.defaultProps = {
  gameState: {},
  handleGamePreview: () => {},
  teams: [],
};
