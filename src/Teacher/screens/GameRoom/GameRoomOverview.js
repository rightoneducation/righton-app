import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import styles from './styles';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import { colors } from '../../../utils/theme';

export default function GameRoomOverview({
  gameState,
  handleEndGame,
  handleGamePreview,
  handleRenderNewGame,
  handleStartRandomGame,
  nextTeam,
  players,
  teams,
}) {
  const gameKeys = typeof gameState === 'object' ? Object.keys(gameState) : [];
  return (
    <ScrollView
      contentContainerStyle={[styles.dashboardContainer, styles.extraPaddingBottom]}
    >
      <ButtonBack
        iconName={'close'}
        onPress={handleEndGame}
      />
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
        Number of teams: { Object.keys(teams).length }
      </Text>
      <Text
        style={[
          styles.textLabel, styles.textNormal, styles.textCenter, styles.extraMarginBottom
        ]}
      >
        Number of players: { Object.keys(players).length }
      </Text>

      <ButtonWide
        buttonStyles={{
          position: 'relative',
          marginVertical: 15,
        }}
        label={nextTeam ? 'Begin Quizzing' : 'Close Gameroom'}
        onPress={nextTeam ? handleStartRandomGame : handleEndGame}
      />

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
      <ButtonWide
        buttonStyles={{
          backgroundColor: colors.dark,
          borderColor: colors.primary,
          borderWidth: 1,
        }}
        label={'New game'}
        onPress={handleRenderNewGame}
      />
    </ScrollView>
  );
}

GameRoomOverview.propTypes = {
  gameState: PropTypes.shape({}),
  handleEndGame: PropTypes.func.isRequired,
  handleGamePreview: PropTypes.func.isRequired,
  handleRenderNewGame: PropTypes.func.isRequired,
  handleStartRandomGame: PropTypes.func.isRequired,
  nextTeam: PropTypes.string,
  players: PropTypes.shape({}),
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomOverview.defaultProps = {
  gameState: {},
  handleEndGame: () => {},
  handleGamePreview: () => {},
  handleRenderNewGame: () => {},
  handleStartRandomGame: () => {},
  nextTeam: '',
  players: {},
  teams: [],
};
