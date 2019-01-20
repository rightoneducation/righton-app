import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import {
  generateUniqueGameRoomIDInDynamoDB,
  putGameToDynamoDB,
} from '../../../../lib/Categories/DynamoDB/TeacherGameRoomAPI';
import Swiper from 'react-native-swiper';
import Touchable from 'react-native-platform-touchable';
import Portal from '../../../screens/Portal';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import LocalStorage from '../../../../lib/Categories/LocalStorage';
import { colors, deviceWidth, fonts } from '../../../utils/theme';
import firstStyles from '../../../Student/screens/StudentFirst/styles';
import gamesStyles from '../Games/styles';
import debug from '../../../utils/debug';

const blockSize = deviceWidth / 4;


class Launch extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      account: PropTypes.shape({
        username: PropTypes.string,
      }),
      deviceSettings: PropTypes.shape({
        quizTime: PropTypes.string,
        trickTime: PropTypes.string,
      }),
      gameState: PropTypes.shape({}),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      IOTSubscribeToTopic: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      account: {
        username: '',
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

    this.hydratedGames = false;

    this.state = {
      room: props.screenProps.GameRoomID,
      games: [],
      // GameRoomID: '',
    };

    this.handleRoomInput = this.handleRoomInput.bind(this);
    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    // this.handleTeamSelection = this.handleTeamSelection.bind(this);

    // this.handleBackFromTeams = this.handleBackFromTeams.bind(this);
    this.handleBackFromHost = this.handleBackFromHost.bind(this);

    this.handleGameRoomID = this.handleGameRoomID.bind(this);
    this.handleGameRoomError = this.handleGameRoomError.bind(this);
  }


  handleRoomInput(room) {
    this.setState({ room });
  }


  async hydrateGames() {
    if (this.hydratedGames) return;
    try {
      const { TeacherID } = this.props.screenProps.account;
      if (!TeacherID) {
        // TODO! Notify user that they must create an account to create a game
        return;
      }
      let games;
      games = await LocalStorage.getItem(`@RightOn:${TeacherID}/Games`);
      if (typeof games === 'string') {
        games = JSON.parse(games);
        this.hydratedGames = true;
        this.setState({ games });
      }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Games, hydrateGames():', exception);
    }
  }


  async handleRoomSubmit() {
    this.swiperRef.scrollBy(2, false);
    setTimeout(() => {
      this.swiperRef.scrollBy(2, false);
    }, 1500);

    // Hydrate Dashboard w/ game details
    if (!this.hydratedGames) this.hydrateGames();
    

    /* Previous code before generating unique GameRoomID */

    // const { room } = this.state;
    // const { session } = this.props.screenProps;
    // let username = null;
    // if (session && session.idToken && session.idToken.payload) {
    //   username = session.idToken.payload['cognito:username'];
    // }
    // // this.props.screenProps.handleSetAppState('gameroom', room);

    // getGameFromDynamoDB(room,
    //   (res) => {
    //     if (res && (res.username && username !== res.username)) {
    //       // Invalid teacher account -- forbid access!
    //       setTimeout(() => this.swiperRef.scrollBy(-2, false), 500);
    //       // TODO Send message that account errLaunch room w/ different name
    //     } else if (res && (username === res.username || res.username === null)) {
    //       debug.log('Username matches and game room still exists: Enter');
    //       setTimeout(() => this.swiperRef.scrollBy(2, false), 500);
    //     } else if (!res || (res && !res.GameRoomId)) {
    //       debug.log('GameRoom w/ ID does not exist: Create & Enter');
    //       putGameToDynamoDB(room, username,
    //         (putRes) => {
    //           setTimeout(() => this.swiperRef.scrollBy(2, false), 500);
    //           debug.log('Put game in DynamoDB!', putRes);
    //         },
    //         (exception) => {
    //           setTimeout(() => this.swiperRef.scrollBy(2, false), 500);
    //           debug.log('Error putting game in DynamoDB', exception);
    //         }
    //       );
    //     }
    //   },
    //   (exception) => {
    //     // TODO Handle exception
    //     setTimeout(() => this.swiperRef.scrollBy(-2, false), 500);
    //     debug.log('Exception getting game from DynamoDB', exception);
    //   });
  }


  handleBackFromHost() {
    this.swiperRef.scrollBy(-3, false);
  }


  handleGameSelection(e, game) {
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

    this.props.screenProps.navigation.navigate('TeacherGameRoom');
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
      games,
      room,
    } = this.state;

    return (
      <Swiper
        horizontal
        index={0}
        loadMinimal
        loop={false}
        ref={(ref) => { this.swiperRef = ref; }}
        scrollEnabled={false}
        showsPagination={false}
      >


        <View style={firstStyles.container}>
          <StatusBar backgroundColor={colors.dark} />
          <Text style={firstStyles.title}>Game Room</Text>
          <TextInput
            keyboardType={'default'}
            maxLength={30}
            multiline={false}
            onChangeText={this.handleRoomInput}
            onSubmitEditing={this.handleRoomSubmit}
            placeholder={'Enter Game Code'}
            placeholderTextColor={colors.primary} 
            returnKeyType={'done'}
            style={firstStyles.input}
            textAlign={'center'}
            underlineColorAndroid={colors.dark}   
            value={room}
          />
          {/* <Text style={styles.optional}>Optional</Text> */}
          <ButtonWide
            label={'Launch'}
            onPress={this.handleRoomSubmit}
          />
        </View>

        {/* 
          * These Views act as padding between the screens because of the
          * extended circular region overlapping the nearby screens.
          */}
        <View />
        <Portal messageType={'single'} messageValues={{ message: `Launching ${room}` }} />
        <View />

        <ScrollView contentContainerStyle={[firstStyles.container, styles.scrollview]}>
          <ButtonBack
            onPress={this.handleBackFromHost}
          />
          <Text style={firstStyles.title}>Host a game</Text>
          {games.map(game => this.renderGameBlock(game))}
        </ScrollView>
      </Swiper>
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
  // optional: {
  //   color: colors.primary,
  //   bottom: 1,
  //   fontSize: fonts.small,
  //   position: 'absolute',
  // },
  scrollview: {
    justifyContent: 'flex-start',
    paddingBottom: '50@vs',
    paddingTop: '90@vs',
  },
});


export default props => <Launch screenProps={{ ...props }} />;
