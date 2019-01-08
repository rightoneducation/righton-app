import React from 'react';
import {
  // Image,
  ScrollView,
  // StatusBar,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
// import Swiper from 'react-native-swiper';
import Touchable from 'react-native-platform-touchable';
import Portal from '../../../screens/Portal';
// import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
// import LocalStorage from '../../../../lib/Categories/LocalStorage';
// import { colors, deviceWidth, fonts } from '../../../utils/theme';
import styles from './styles';
// import debug from '../../../utils/debug';


export default class GameRoom extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({}),
      // handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        state: PropTypes.shape({
          params: PropTypes.shape({}),
        }),
      }),
      players: PropTypes.shape({}),
    }),
  }
  
  static defaultProps = {
    screenProps: {
      gameState: {},
      // handleSetAppState: () => {},
      IOTPublishMessage: () => {},
      navigation: {
        navigate: () => {},
        state: {
          params: {},
        },
      },
      players: {},
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      portal: `Joining ${props.screenProps.navigation.state.params.GameRoomID}`,
      renderType: 'portal',
      teams: [],
    };

    this.mounted = true;

    this.handleStartGame = this.handleStartGame.bind(this);
  }


  componentDidMount() {
    setTimeout(() => this.mounted && this.setState({ portal: false, renderType: 'start' }), 2000);
  }


  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.screenProps.players).length !==
      Object.keys(nextProps.screenProps.players).length) {
      const teams = [];
      const playerValues = Object.values(nextProps.screenProps.players);
  
      for (let i = 0; i < playerValues.length; i += 1) {
        teams[playerValues[i]] = 
          teams[playerValues[i]] === undefined ? 1 : teams[playerValues[i]] + 1;
      }
      this.setState({ teams });
    }
  }

  
  componentWillUnmount() {
    this.mounted = false;
  }


  handleStartGame() {
    const message = {
      action: 'START_GAME',
      uid: `${Math.random()}`,
      payload: { start: true },
    };
    this.props.screenProps.IOTPublishMessage(message);
    setTimeout(() => this.mounted && this.setState({ portal: '5', renderType: 'portal' }), 256);
    setTimeout(() => this.mounted && this.setState({ portal: '4' }), 1000);
    setTimeout(() => this.mounted && this.setState({ portal: '3' }), 2000);
    setTimeout(() => this.mounted && this.setState({ portal: '2' }), 3000);
    setTimeout(() => this.mounted && this.setState({ portal: '1' }), 4000);
    setTimeout(() => this.mounted && this.setState({ portal: 'RightOn!' }), 5000);
    setTimeout(() => this.mounted && this.setState({ portal: false, renderType: 'game' }), 5500);
  }


  renderPortal() {
    const { portal } = this.state;
    return (
      <Portal
        messageType={'single'}
        messageValues={{
          message: portal,
        }}
      />
    );
  }


  renderStartScreen() {
    const { gameState, players } = this.props.screenProps;
    const { teams } = this.state;

    return (
      <ScrollView
        contentContainerStyle={styles.dashboardContainer}
      >
        <View style={styles.playersContainer}>
          <Text style={[styles.textLabel, styles.textNumber]}>{ Object.keys(players).length }</Text>
          <Text style={styles.textLabel}>Players</Text>
        </View>
        <View style={styles.teamsContainer}>
          {teams.map((val, idx) => (
            <View key={`${Math.random()}`} style={styles.playersContainer}>
              <Text style={[styles.textLabel, styles.textNumber]}>{ val }</Text>
              <Text style={styles.textLabel}>{ `Team ${idx + 1}` }</Text>
            </View>
          ))}
        </View>
        {!gameState.start &&
          <ButtonWide
            label={'Start Game'}
            onPress={this.handleStartGame}
          />}
      </ScrollView>
    );
  }


  renderGameScreen() {
    const { gameState } = this.props.screenProps;
    const { teams } = this.state;
    const gameKeys = Object.keys(gameState);
    return (
      <ScrollView
        contentContainerStyle={styles.dashboardContainer}
      >
        {gameKeys.map((key) => {
          if (!key.includes('team')) return null;
          const teamNumber = parseInt(key.substr(4), 10);
          return (
            key.includes('team') &&
              <Touchable
                activeOpacity={0.8}
                key={gameState[key].uid}
                onPress={() => {}}
              >
                <View style={styles.gameContainer}>
                  <Text style={styles.textLabel}>{ `Team ${teamNumber + 1}` }</Text>
                  <Text style={styles.textLabel}>{ `${teams[teamNumber]} players` }</Text>
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


  render() {
    const {
      renderType,
    } = this.state;

    switch (renderType) {
      case 'portal':
        return this.renderPortal();
      case 'start':
        return this.renderStartScreen();
      case 'game':
        return this.renderGameScreen();
      default:
        return null;
    }
  }
}
