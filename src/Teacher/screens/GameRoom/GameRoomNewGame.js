import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import Touchable from 'react-native-platform-touchable';
import Portal from '../../../screens/Portal';
import ButtonBack from '../../../components/ButtonBack';
import LocalStorage from '../../../../lib/Categories/LocalStorage';
import { colors, deviceWidth, fonts } from '../../../utils/theme';
import firstStyles from '../../../Student/screens/StudentFirst/styles';
import gamesStyles from '../Games/styles';
import debug from '../../../utils/debug';

const blockSize = deviceWidth / 4;


export default class GameRoomNewGame extends React.Component {
  static propTypes = {
    GameRoomID: PropTypes.string,
    handleBackFromChild: PropTypes.func.isRequired,
    handleSetAppState: PropTypes.func.isRequired,
    IOTPublishMessage: PropTypes.func.isRequired,
    TeacherID: PropTypes.string,
  };
  
  static defaultProps = {
    GameRoomID: '',
    handleBackFromChild: () => {},
    handleSetAppState: () => {},
    IOTPublishMessage: () => {},
    TeacherID: '',
  };
  
  constructor(props) {
    super(props);

    this.hydratedGames = false;

    this.state = {
      portal: '',
      games: [],
    };
  }


  componentDidMount() {
    this.hydrateGames();
  }


  async hydrateGames() {
    if (this.hydratedGames) return;
    try {
      const { TeacherID } = this.props;
      if (!TeacherID) {
        // TODO! Notify user that they must create an account to create a game
        return;
      }
      let games;
      games = await LocalStorage.getItem(`@RightOn:${TeacherID}/Games`);
      if (Array.isArray(games)) {
        games = JSON.parse(games);
        this.hydratedGames = true;
        this.setState({ games });
      }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Games, hydrateGames():', exception);
    }
  }


  handleGameSelection(e, game) {
    const teamQuestions = {};
    game.questions.forEach((question, idx) => {
      teamQuestions[`team${idx}`] = {
        ...question,
        /*
         * question's default props:
        answer: PropTypes.string,
        image: PropTypes.string,
        instructions: PropTypes.arrayOf(PropTypes.string),
        question: PropTypes.string,
        uid: PropTypes.string,
        */
        uid: `${Math.random()}`,
        tricks: [],
        choices: [],
        points: 0,
      };
    });

    const gameState = {
      banner: game.banner,
      quizTime: gameState.quizTime,
      title: game.description,
      trickTime: gameState.trickTime,
      description: game.description,
      ...teamQuestions,
      GameRoomID: this.props.GameRoomID,
      room: gameState.room,
      state: {
        newGame: true,
      },
    };
    
    this.props.handleSetAppState('gameState', gameState);

    const message = {
      action: 'NEW_GAME',
      uid: `${Math.random()}`,
      payload: gameState,
    };
    this.props.IOTPublishMessage(message);
    this.props.handleBackFromChild('start');
  }


  renderGameBlock(game) {
    return (
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.dark, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        key={game.title}
        onPress={() => this.handleGameSelection(null, game)}
      >
        <View style={gamesStyles.gameButton}>
          <View style={gamesStyles.imageContainer}>
            {game.image ?
              <Image source={{ uri: game.image }} style={gamesStyles.image} />
              :
              <Text style={gamesStyles.imageLabel}>RightOn!</Text>}
          </View>
          <Text style={gamesStyles.gameTitle}>{ game.title }</Text>
          <Text style={[gamesStyles.gameTitle, gamesStyles.gameDescription]}>
            { game.description }
          </Text>
          <Text style={gamesStyles.gameCount}>{ `${game.questions.length}Q` }</Text>
        </View>
      </Touchable>
    );
  }


  render() {
    const {
      portal,
      games,
    } = this.state;

    const { handleBackFromChild } = this.props;

    return (
      <ScrollView contentContainerStyle={[firstStyles.container, styles.scrollview]}>
        { Platform.OS === 'ios' && <KeepAwake /> }

        {Boolean(portal) &&
          <Portal messageProps={{ message: 'Launching new game' }} />}
        <ButtonBack
          onPress={handleBackFromChild}
        />
        <Text style={firstStyles.title}>New game</Text>
        {games.map(game => this.renderGameBlock(game))}
      </ScrollView>
    );
  }
}


const styles = ScaledSheet.create({
  blockContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: blockSize,
    justifyContent: 'center',
    marginBottom: '15@vs',
    width: blockSize,
  },
  blocksContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: '15@s',
  },
  blockNumber: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  scrollview: {
    justifyContent: 'flex-start',
    paddingBottom: '50@vs',
    paddingTop: '90@vs',
  },
});
