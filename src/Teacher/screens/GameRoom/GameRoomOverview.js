import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import KeepAwake from 'react-native-keep-awake';
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
      { Platform.OS === 'ios' && <KeepAwake /> }

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
        label={nextTeam ? 'Start Game' : 'Close Gameroom'}
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
                    style={styles.choiceItem}
                  >
                    <View style={[styles.choiceButton, styles.choiceSquare]}>
                      {trick.selected &&
                        <Aicon name={'check'} style={styles.choiceCheck} />}
                    </View>
                    <Text style={styles.choiceValue}>{ trick.value }</Text>
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
  gameState: gameStatePropTypes,
  handleEndGame: PropTypes.func.isRequired,
  handleGamePreview: PropTypes.func.isRequired,
  handleRenderNewGame: PropTypes.func.isRequired,
  handleStartRandomGame: PropTypes.func.isRequired,
  nextTeam: PropTypes.string,
  players: PropTypes.shape({}),
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomOverview.defaultProps = {
  gameState: gameStateDefaultProps,
  handleEndGame: () => {},
  handleGamePreview: () => {},
  handleRenderNewGame: () => {},
  handleStartRandomGame: () => {},
  nextTeam: '',
  players: {},
  teams: [],
};
