import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import { scale } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import styles from './styles';
import { colors, fonts } from '../../../utils/theme';

export default function GameRoomStart({
  GameRoomID,
  gameState,
  handleBackFromChild,
  handleEndGame,
  handleStartGame,
  players,
  teams
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.dashboardContainer}
    >
      { Platform.OS === 'ios' && <KeepAwake /> }

      <ButtonBack
        iconName={'close'}
        onPress={handleEndGame}
      />
      <Text style={[styles.textLabel, styles.textLarge, styles.textCenter]}>
        { gameState.GameRoomID }
      </Text>

      <ButtonBack
        buttonStyles={{
          right: scale(15),
          left: null,
        }}
        iconName={'gear'}
        onPress={() => handleBackFromChild('settings')}
      />

      <ButtonWide
        buttonStyles={{
          position: 'relative',
          backgroundColor: colors.dark,
          borderColor: colors.primary,
          borderWidth: 1,
          marginTop: 25,
        }}
        textStyles={{
          fontWeight: 'bold',
          fontSize: fonts.large,
        }}
        label={GameRoomID ? `Enter game with: ${GameRoomID}` : 'Generating game room...'}
        onPress={() => {}}
      />

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
  GameRoomID: PropTypes.string,
  gameState: gameStatePropTypes,
  handleBackFromChild: PropTypes.func.isRequired,
  handleEndGame: PropTypes.func.isRequired,
  handleStartGame: PropTypes.func.isRequired,
  players: PropTypes.shape({}),
  teams: PropTypes.arrayOf(PropTypes.number),
};

GameRoomStart.defaultProps = {
  GameRoomID: '',
  gameState: gameStateDefaultProps,
  handleBackFromChild: () => {},
  handleEndGame: () => {},
  handleStartGame: () => {},
  players: {},
  teams: [],
};
