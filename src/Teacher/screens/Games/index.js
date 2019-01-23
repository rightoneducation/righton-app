import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import {
  generateUniqueGameRoomIDInDynamoDB,
  putGameToDynamoDB,
} from '../../../../lib/Categories/DynamoDB/TeacherGameRoomAPI';
import Aicon from 'react-native-vector-icons/FontAwesome';
import GameBuilder from './GameBuilder';
import { colors } from '../../../utils/theme';
import debug from '../../../utils/debug';
import styles from './styles';

import {
  getTeacherItemFromDynamoDB,
  putTeacherItemInDynamoDB,
} from '../../../../lib/Categories/DynamoDB/TeacherAccountsAPI';
import LocalStorage from '../../../../lib/Categories/LocalStorage';


class Games extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      account: PropTypes.shape({
        games: PropTypes.shape({
          local: PropTypes.number,
          db: PropTypes.number,
        }),
        TeacherID: PropTypes.string,
      }),
      deviceSettings: PropTypes.shape({
        quizTime: PropTypes.string,
        trickTime: PropTypes.string,
      }),
      gameState: PropTypes.shape({}),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      IOTSubscribeToTopic: PropTypes.func.isRequired,
      // Root navigation (Switch Navigator)
      navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      account: {
        games: PropTypes.shape({
          local: 0,
          db: 0,
        }),
        TeacherID: '',
      },
      deviceSettings: {
        quizTime: '',
        trickTime: '',
      },
      gameState: {},
      handleSetAppState: () => {},
      IOTPublishMessage: () => {},
      IOTSubscribeToTopic: () => {},
      navigation: {
        navigate: () => {},
      },
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {
      openGame: null,
      games: [],
    };

    this.currentGame = null;

    this.handleCloseGame = this.handleCloseGame.bind(this);
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.handleOpenGame = this.handleOpenGame.bind(this);

    this.handlePlayGame = this.handlePlayGame.bind(this);
    this.handleGameRoomID = this.handleGameRoomID.bind(this);
    this.handleGameRoomError = this.handleGameRoomError.bind(this);
  }


  componentDidMount() {
    this.hydrateGames();
  }
  

  getGamesFromDynamoDB(TeacherID) {
    getTeacherItemFromDynamoDB(
      'TeacherGamesAPI',
      TeacherID,
      (res) => {
        this.setState({ games: res });
        const gamesJSON = JSON.stringify(res);
        LocalStorage.setItem(`@RightOn:${TeacherID}/Games`, gamesJSON);
        debug.log('Successful GETTING teacher games from DynamoDB to hydrate local state in games:', JSON.stringify(res));
      },
      exception => debug.warn('Error GETTING teacher games from DynamoDB to hydrate local state in games:', JSON.stringify(exception))
    );
  }

  
  async hydrateGames() {
    try {
      const { TeacherID } = this.props.screenProps.account;
      if (!TeacherID) {
        // TODO! Notify user that they must create an account to create a game
        return;
      }
      let games = [];
      games = await LocalStorage.getItem(`@RightOn:${TeacherID}/Games`);
      if (typeof games === 'string') {
        games = JSON.parse(games);
        this.setState({ games }, () => {
          const { account } = this.props.screenProps;
          if (account.games.local !== account.games.db) {
            // Previous attempt to save games to DynamoDB failed so we try again.
            this.saveGamesToDatabase(games);
          }
        });
      } else if (games === undefined || games === null) {
        // User signed in on a different device so let's get their games from the cloud
        // and hydrate state as well as store them in LocalStorage.

        // Note: technically we handle this is App.js when user signs in with a username
        // that is different from that of the one saved on device, but we'll leave this
        // here just in case as a fallback.
        this.getGamesFromDynamoDB(TeacherID);
      }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Games, hydrateGames():', exception);
    }
  }


  handleOpenGame(event, game = {}, idx = null) {
    this.currentGame = idx;
    this.setState({ openGame: game });
  }


  handleCloseGame() {
    this.setState({ openGame: null });
    this.currentGame = null;
  }


  handleCreateGame(game) {
    const { games } = this.state;
    if (this.currentGame === null) {
      const updatedGames = [game, ...games];
      this.setState({ games: updatedGames, openGame: null });
      this.saveGamesToDatabase(updatedGames);
    } else {
      const updatedGames = [...games];
      updatedGames.splice(this.currentGame, 1, game);
      this.setState({ games: updatedGames, openGame: null });
      this.saveGamesToDatabase(updatedGames);
      this.currentGame = null;
    }
  }


  saveGamesToDatabase = async (updatedGames) => {
    const { TeacherID } = this.props.screenProps.account;
    if (TeacherID) {
      const stringifyGames = JSON.stringify(updatedGames);
      LocalStorage.setItem(`@RightOn:${TeacherID}/Games`, stringifyGames);

      const { account, handleSetAppState } = this.props.screenProps;
      const update = {
        games: {
          local: account.games.local + 1,
          db: account.games.db,
        },
      };
      handleSetAppState('account', update);

      putTeacherItemInDynamoDB(
        'TeacherGamesAPI',
        TeacherID,
        { games: updatedGames },
        (res) => {
          update.games.db = account.games.db + 1;
          handleSetAppState('account', update);
          debug.log('Successfully PUT new teacher item into DynamoDB', JSON.stringify(res));
        },
        exception => debug.warn('Error PUTTING new teacher item into DynamoDB', JSON.stringify(exception)),
      );
    }
  }


  handlePlayGame(e, game) {
    const { room } = this.state;
    const { quizTime, trickTime } = this.props.screenProps.deviceSettings;

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
      GameID: game.GameID,
      answering: null,
      banner: game.banner,
      title: game.description,
      description: game.description,
      quizTime,
      trickTime,
      ...teamQuestions,
      // GameRoomID: '######',
      room,
      state: {},
    };
    
    this.props.screenProps.handleSetAppState('gameState', gameState);

    generateUniqueGameRoomIDInDynamoDB(this.handleGameRoomID, this.handleGameRoomError);

    this.handleCloseGame();
    setTimeout(() => {
      this.props.screenProps.navigation.navigate('TeacherGameRoom');
    }, 0);
  }


  handleGameRoomID(GameRoomID) {
    this.props.screenProps.handleSetAppState('GameRoomID', GameRoomID);
    debug.log('Received GameRoomID:', GameRoomID);
    this.props.screenProps.IOTSubscribeToTopic(GameRoomID);

    putGameToDynamoDB(GameRoomID, null,
      (putRes) => {
        debug.log('Put game in DynamoDB!', putRes);
      },
      (exception) => {
        // setTimeout(() => this.swiperRef.scrollBy(-4, false), 500);
        debug.log('Error putting game in DynamoDB', exception);
      }
    );
  }


  handleGameRoomError = (exception) => {
    debug.log('Error generating a random GameRoomID!', JSON.stringify(exception));
  }


  renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Games</Text>
      <Touchable
        activeOpacity={0.8}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        onPress={this.handleOpenGame}
        style={styles.plusButton}
      >
        <Aicon name={'plus'} style={styles.plusIcon} />
      </Touchable>
    </View>
  );


  renderGameBlock(game, idx) {
    return (
      <View
        key={game.title}
        style={styles.gameButton}
      >
        <View style={styles.imageContainer}>
          {game.image ?
            <Image source={{ uri: game.image }} style={styles.image} />
            :
            <Text style={styles.imageLabel}>RightOn!</Text>}
            <Text style={styles.gameCount}>{ `${game.questions.length} Team${game.questions.length === 1 ? '' : 's'}` }</Text>
        </View>
        <View style={styles.gameColumn}>
          <Text numberOfLines={2} style={styles.gameTitle}>{ game.title }</Text>
          <Text
            numberOfLines={3}
            style={[styles.gameTitle, styles.gameDescription]}
          >
            { game.description }
          </Text>
        </View>
        <Touchable
          activeOpacity={0.8}
          background={Touchable.Ripple(colors.primary, false)}
          hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
          onPress={() => this.handleOpenGame(null, game, idx)}
          style={styles.gameOpenButton}
        >
          <Text style={styles.gameOpenText}>Open game</Text>
        </Touchable>
        <Touchable
          activeOpacity={0.8}
          background={Touchable.Ripple(colors.primary, false)}
          hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
          onPress={() => this.handlePlayGame(null, game)}
          style={[styles.gameOpenButton, styles.gamePlayButton]}
        >
          <Aicon name={'play'} style={styles.gamePlayIcon} />
        </Touchable>
      </View>
    );
  }


  renderGames() {
    const { games } = this.state;
    if (!Array.isArray(games)) return null;

    return (
      <ScrollView contentContainerStyle={styles.scrollview}>
        {games.map((game, idx) => this.renderGameBlock(game, idx))}
      </ScrollView>
    );
  }


  render() {
    const { openGame } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        {openGame &&
          <GameBuilder
            currentGame={this.currentGame}
            handleClose={this.handleCloseGame}
            handleCreateGame={this.handleCreateGame}
            handlePlayGame={this.handlePlayGame}
            game={openGame}
            visible
          />}
        {this.renderHeader()}
        {this.renderGames()}
      </View>
    );
  }
}


export default props => <Games screenProps={{ ...props }} />;
