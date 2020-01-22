import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import { cancelCountdownTimer, startCountdownTimer } from '../../../utils/countdownTimer';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import KeepAwake from 'react-native-keep-awake';
import styles from './styles';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import Message from '../../../components/Message';
import { colors } from '../../../utils/theme';

export default class GameRoomOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonEnabled: false,
      messageProps: {},
      timeLeft: props.gameState.trickTime && props.gameState.trickTime !== '0:00' ?
        props.gameState.trickTime : 'No time limit',
    };
  }

  componentDidMount() {
    this.startTrickTimer();
  }

  componentWillUnmount() {
    cancelCountdownTimer();
  }

  setTime = timeLeft => this.setState({ timeLeft });

  startTrickTimer = () => {
    const { timeLeft } = this.state;
    if (timeLeft !== '0:00' && timeLeft !== 'No time limit') {
      setTimeout(() =>
        startCountdownTimer(null, timeLeft, this.setTime, this.enableButtonStyle),
      5000);
    }
  }

  enableButtonStyle = () => this.setState({ buttonEnabled: true });

  handleOverrideGameButton = () => {
    const {
      handleEndGame,
      handleStartRandomGame,
      nextTeam,
    } = this.props;
    cancelCountdownTimer();
    if (nextTeam) {
      handleStartRandomGame();
    } else {
      handleEndGame();
    }
  }

  handleGameButton = () => {
    if (!this.state.buttonEnabled) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          message: 'Tricks answers are still in session\nLong-press to override',
          timeout: 4000,
        },
      });
      return;
    }
    const {
      handleEndGame,
      handleStartRandomGame,
      nextTeam,
    } = this.props;
    cancelCountdownTimer();
    if (nextTeam) {
      handleStartRandomGame();
    } else {
      handleEndGame();
    }
  }

  handleCloseMessage = () => this.setState({ messageProps: {} });

  renderGameRoomID = () => {
    const { gameRoom } = this.props;
    return (
      <Text style={[styles.textLabel, styles.textCenter]}>
        { gameRoom }
      </Text>
    );
  }

  renderTeamsCount = () => {
    const { teams } = this.props;
    return (
      <Text
        style={[
          styles.textLabel, styles.textNormal, styles.textCenter, styles.marginBottom
        ]}
      >
        Number of teams: { Object.keys(teams).length }
      </Text>
    );
  }

  renderPlayersCount = () => {
    const { players } = this.props;
    return (
      <Text
        style={[
          styles.textLabel, styles.textNormal, styles.textCenter, styles.extraMarginBottom
        ]}
      >
        Number of players: { Object.keys(players).length }
      </Text>
    );
  }

  renderGameRoomDetails = () => {
    const { gameState, handleGamePreview, teams } = this.props;
    const gameKeys = typeof gameState === 'object' ? Object.keys(gameState) : [];

    return gameKeys.map((key) => {
      if (!key.includes('team')) return null;
      const teamIdx = parseInt(key.substr(4), 10);
      return (
        key.includes('team') &&
          <Touchable
            activeOpacity={0.8}
            key={gameState[key].uid}
            onPress={() => handleGamePreview(`team${teamIdx}`, 'preview')}
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
              <Text style={[styles.textLabel, styles.marginBottom]}>Trick Answers:</Text>
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
    });
  }

  render() {
    const {
      handleEndGame,
      handleRenderNewGame,
      nextTeam,
    } = this.props;

    const {
      buttonEnabled,
      messageProps,
      timeLeft
    } = this.state;

    return (
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.dashboardContainer, styles.extraPaddingBottom]}
        >
          <KeepAwake />

          <ButtonBack
            iconName={'close'}
            onPress={handleEndGame}
          />

          { this.renderGameRoomID() }

          { this.renderTeamsCount() }

          { this.renderPlayersCount() }

          <ButtonWide
            buttonStyles={{
              position: 'relative',
              marginVertical: 15,
              backgroundColor: buttonEnabled ? colors.primary : colors.lightGray,
            }}
            label={nextTeam ? 'Start Voting Round' : 'Close Gameroom'}
            onLongPress={this.handleOverrideGameButton}
            onPress={this.handleGameButton}
          />

          { this.renderGameRoomDetails() }

        </ScrollView>

        {Boolean(timeLeft) &&
          <Text style={styles.timeContainer}>{ timeLeft }</Text>}
        <Message {...messageProps} />
      </View>
    );
  }
}

GameRoomOverview.propTypes = {
  gameRoom: PropTypes.string.isRequired,
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
  gameRoom: '',
  gameState: gameStateDefaultProps,
  handleEndGame: () => {},
  handleGamePreview: () => {},
  handleRenderNewGame: () => {},
  handleStartRandomGame: () => {},
  nextTeam: '',
  players: {},
  teams: [],
};
