import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import styles from './styles';

export default function GameRoomOverview({ gameState, handleGamePreview, players, teams }) {
  const gameKeys = typeof gameState === 'object' ? Object.keys(gameState) : [];
  return (
    <ScrollView
      contentContainerStyle={styles.dashboardContainer}
    >
      <Text 
        style={[
          styles.textLabel, styles.textLarge, styles.textCenter, styles.extraMarginBottom
        ]}
      >
        { gameState.GameRoomID }
      </Text>
      <Text 
        style={[
          styles.textLabel, styles.textNormal, styles.textCenter, styles.marginBottom
        ]}
      >
        Total number of teams: { teams.length }
      </Text>
      <Text
        style={[
          styles.textLabel, styles.textNormal, styles.textCenter, styles.extraMarginBottom
        ]}
      >
        Total number of players: { Object.keys(players).length }
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
                <View style={[styles.gameRow, styles.marginBottom]}>
                  <Text style={styles.textLabel}>{ `Team ${teamIdx + 1}` }</Text>
                  <Text style={styles.textLabel}>{ teams[teamIdx] === 1 ? '1 player' : `${teams[teamIdx]} players` }</Text>
                </View>
                <Text style={[styles.textLabel, styles.textNormal]}>Question:</Text>
                <Text style={[styles.textLabel, styles.marginBottom]}>
                  { gameState[key].question }
                </Text>
                <Text style={[styles.textLabel, styles.marginBottom]}>Tricks:</Text>
                {gameState[key].tricks.map(trick => (
                  <View
                    key={trick.uid}
                    style={styles.trickItem}
                  >
                    <View
                      style={[
                        styles.trickButton,
                        trick.selected && styles.trickButtonSelected
                      ]}
                    />
                    <Text style={styles.trickValue}>{ trick.value }</Text>
                  </View>
                ))}
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
  players: PropTypes.shape({}),
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomOverview.defaultProps = {
  gameState: {},
  handleGamePreview: () => {},
  players: {},
  teams: [],
};
