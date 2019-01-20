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
      handleSetAppState: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        navigate: PropTypes.func,
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
      handleSetAppState: () => {},
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


  handleOpenGame(event, game = {}, idx) {
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
      const updatedGames = [...games, game];
      this.setState({ games: updatedGames, openGame: null });
      this.saveGamesToDatabase(updatedGames);
    } else {
      const updatedGames = [...games];
      updatedGames.splice(this.currentGame, 1, game);
      this.setState({ games: updatedGames, openGame: null });
      this.saveGamesToDatabase(updatedGames);
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
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.dark, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        key={game.title}
        onPress={() => this.handleOpenGame(null, game, idx)}
      >
        <View style={styles.gameButton}>
          <View style={styles.imageContainer}>
            {game.image ?
              <Image source={{ uri: game.image }} style={styles.image} />
              :
              <Text style={styles.imageLabel}>RightOn!</Text>}
          </View>
          <Text style={styles.gameTitle}>{ game.title }</Text>
          <Text style={[styles.gameTitle, styles.gameDescription]}>{ game.description }</Text>
          <Text style={styles.gameCount}>{ `${game.questions.length}Q` }</Text>
        </View>
      </Touchable>
    );
  }


  renderGames() {
    const { games } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.scrollview}>
        {games.map((game, idx) => this.renderGameBlock(game, idx))}
      </ScrollView>
    );
  }


  render() {
    const { openGame } = this.state;
    // const { navigation } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        {openGame &&
          <GameBuilder
            currentGame={this.currentGame}
            handleClose={this.handleCloseGame}
            handleCreateGame={this.handleCreateGame}
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
