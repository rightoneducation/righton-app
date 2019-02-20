import React from 'react';
import {
  // Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { getGamesFromDynamoDB } from '../../../../lib/Categories/DynamoDB/ExploreGamesAPI';
import { playGame, saveGamesToDatabase } from '../../../utils/gameBuilder';
// import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, fonts } from '../../../utils/theme';
import debug from '../../../utils/debug';
import MainHeader from '../../components/MainHeader';
import GameBuilder from '../Games/GameBuilder';
import LocalStorage from '../../../../lib/Categories/LocalStorage';


class Explore extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      navigation: PropTypes.shape({
        navigate: PropTypes.func,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      navigation: {
        navigate: () => {},
      },
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      viewGame: null,
    };

    this.handleCloseGame = this.handleCloseGame.bind(this);
    this.handleCreateGame = this.handleCreateGame.bind(this);
    this.handlePlayGame = this.handlePlayGame.bind(this);
  }


  componentDidMount() {
    // if (__DEV__) this.hydrateDummyData();
    this.hydrateGamesFromDynamoDB();
  }


  // hydrateDummyData() {
  //   this.setState({
  //     data: [
  //       {
  //         title: 'Triangles or try angles',
  //         description: 'A guide up the pyramids',
  //       },
  //     ],
  //   });
  // }


  hydrateGamesFromDynamoDB() {
    getGamesFromDynamoDB(
      (res) => {
        debug.log('Result from GETTING games from DynamoDB for Explore:', JSON.stringify(res));
        this.hydrateState(res.data);
      },
      exception => debug.warn('Error GETTING games from DynamoDB for Explore:', JSON.stringify(exception))
    );
  }


  hydrateState(data, extraData) {
    if (extraData) {
      this.setState({ data: [...data, ...extraData] });
    } else {
      this.setState({ data });
    }
  }


  handleCloseGame = () => this.setState({ viewGame: null });


  handleCreateGame = async (game) => {
    try {
      const { TeacherID } = this.props.screenProps.account;
      if (!TeacherID) {
        this.handleCloseGame();
        // TODO! Notify user that they must create an account to create a game
        return;
      }
      let games = [];
      games = await LocalStorage.getItem(`@RightOn:${TeacherID}/Games`);
      if (typeof games === 'string') {
        games = JSON.parse(games);

        for (let i = 0; i < games.length; i += 1) {
          if (games[i].GameID === game.GameID) {
            // Prevent adding a game twice
            this.handleCloseGame();
            return;
          }
        }

        games.unshift(game);

        const { account, handleSetAppState } = this.props.screenProps;
        saveGamesToDatabase(games, account, handleSetAppState);
      }
    } catch (exception) {
      debug.log('Caught exception getting Games from LocalStorage @Games, hydrateGames():', exception);
    }
    this.handleCloseGame();
  }


  handlePlayGame = (e, game) => {
    const { quizTime, trickTime } = this.props.screenProps.deviceSettings;
    const { handleSetAppState, IOTSubscribeToTopic } = this.props.screenProps;
    const { navigation } = this.props;

    playGame(
      game,
      quizTime,
      trickTime,
      handleSetAppState,
      this.handleCloseGame,
      navigation,
      IOTSubscribeToTopic,
    );
  }


  handleViewGame(data) {
    const parsedGame = {};
    parsedGame.GameID = data.GameID;
    parsedGame.title = data.title;
    parsedGame.description = data.description;
    parsedGame.grade = data.grade;
    parsedGame.domain = data.domain;
    parsedGame.level = data.level;
    parsedGame.difficulty = data.difficulty;
    parsedGame.questions = [];
    parsedGame.quizmaker = true;
    parsedGame.explore = true; // This let's us know that the game is viewed from Explore tab.
    let questionIndex = 1;
    while (data[`q${questionIndex}`]) {
      parsedGame.questions.push(data[`q${questionIndex}`]);
      parsedGame.questions[questionIndex - 1].uid = `${Math.random()}`;
      questionIndex += 1;
    }
    this.setState({ viewGame: parsedGame });
  }


  renderDataBlock = (data) => {
    if (data.GameID === 'A123456789') return null;
    return (
      <Touchable
        activeOpacity={0.8}
        key={data.title || data.description}
        onPress={() => this.handleViewGame(data)}
      >
        <View style={[styles.dataContainer, data.banner && { flexDirection: 'column', height: 300 }]}>
          <View style={styles.dataBody}>
            <View style={styles.iconContainer}>
              <View style={styles.iconTextContainer}>
                <Text style={styles.iconText}>RightOn!</Text>
              </View>
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataTextTitle}>{data.title}</Text>
              <Text style={styles.dataTextDescription}>{data.description}</Text>
              <Text style={[styles.dataTextDescription, styles.italic]}>{`${data.grade === 'HS' ? '' : `${data.grade}.`}${data.domain}.${data.level}.${data.difficulty}`}</Text>
            </View>
          </View>
        </View>
      </Touchable>
    );
  }


  renderData = data => (
    data.map(dataObj => this.renderDataBlock(dataObj))
  );


  render() {
    const {
      data,
      viewGame,
    } = this.state;

    const { navigation } = this.props;

    if (viewGame) {
      return (
        <GameBuilder
          handleClose={this.handleCloseGame}
          handleCreateGame={this.handleCreateGame}
          handlePlayGame={this.handlePlayGame}
          game={viewGame}
          visible
        />
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        <MainHeader
          navigation={navigation}
          parent={'Explore'}
        />
        <ScrollView contentContainerStyle={styles.scrollview}>
          {this.renderData(data)}
        </ScrollView>
      </View>
    );
  }
}


const styles = ScaledSheet.create({
  banner: {
    height: '200@vs',
    width: deviceWidth - scale(30),
  },
  container: {
    flex: 1,
  },
  dataBody: {
    flex: 1,
    flexDirection: 'row',
    height: '100@vs',
  },
  dataContainer: {
    flexDirection: 'row',
    height: '100@vs',
    marginBottom: '15@vs',
    width: deviceWidth - scale(30),
  },
  dataTextContainer: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'space-around',
    padding: '10@s',
  },
  dataTextDescription: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  dataTextTitle: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  icon: {
    color: colors.white,
    fontSize: '35@ms0.2',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: '100@vs',
    justifyContent: 'center',
    width: '100@vs',
  },
  iconText: {
    color: colors.white,
    fontSize: fonts.small,
    fontStyle: 'italic',
  },
  iconTextContainer: {
    flexDirection: 'row',
  },
  italic: {
    fontStyle: 'italic',
  },
  scrollview: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '25@vs',
  },
});


export default Explore;
