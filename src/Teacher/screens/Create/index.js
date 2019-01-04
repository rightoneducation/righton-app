import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { getGameFromDynamoDB, putGameToDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherAPI';
import Swiper from 'react-native-swiper';
import Touchable from 'react-native-platform-touchable';
import Portal from '../../../screens/Portal';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import LocalStorage from '../../../../lib/Categories/LocalStorage';
import { colors, deviceWidth, fonts } from '../../../utils/theme';
import firstStyles from '../../../Student/screens/StudentFirst/styles';
import quizStyles from '../Quizzes/styles';
import debug from '../../../utils/debug';


const blockSize = deviceWidth / 4;


class Create extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      handleSetGameState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      IOTSubscribeToTopic: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      handleSetGameState: () => {},
      IOTPublishMessage: () => {},
      IOTSubscribeToTopic: () => {},
      navigation: {
        navigate: () => {},
      },
    },
  };
  
  constructor(props) {
    super(props);

    this.hydratedQuizzes = false;

    this.state = {
      activeQuiz: {},
      room: '',
      quizzes: [],
    };

    this.handleRoomInput = this.handleRoomInput.bind(this);
    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    // this.handleTeamSelection = this.handleTeamSelection.bind(this);

    // this.handleBackFromTeams = this.handleBackFromTeams.bind(this);
    this.handleBackFromHost = this.handleBackFromHost.bind(this);
  }


  handleRoomInput(room) {
    this.setState({ room });
  }


  async hydrateQuizzes() {
    if (this.hydratedQuizzes) return;
    let quizzes;
    try {
      quizzes = await LocalStorage.getItem('@RightOn:Quizzes');
      if (quizzes === undefined) {
        LocalStorage.setItem('@RightOn:Quizzes', JSON.stringify([]));
        // TODO! Handle when user is logged in with different account??
        quizzes = [];
      } else {
        quizzes = JSON.parse(quizzes);
        this.hydratedQuizzes = true;
      }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Quizzes, hydrateQuizzes():', exception);
    }
    this.setState({ quizzes });
  }


  async handleRoomSubmit() {
    this.swiperRef.scrollBy(1, false);
    if (!this.hydratedQuizzes) this.hydrateQuizzes();
    // Hydrate Dashboard w/ game details
    const { room } = this.state;
    const { session } = this.props.screenProps;
    let username = null;
    if (session && session.idToken && session.idToken.payload) {
      username = session.idToken.payload['cognito:username'];
    }

    getGameFromDynamoDB(room,
      (res) => {
        if (res && (res.username && username !== res.username)) {
          debug.log('Invalid access!', 'Required username:', res.username, 'Actual username:', username);
          // Invalid teacher account -- forbid access!
          setTimeout(() => this.swiperRef.scrollBy(-1, false), 500);
          // TODO Send message that account error / create room w/ different name
        } else if (res && (username === res.username || res.username === null)) {
          debug.log('Username matches and game room still exists: Enter');
          setTimeout(() => this.swiperRef.scrollBy(1, false), 500);
        } else if (!res || (res && !res.GameRoomId)) {
          debug.log('GameRoom w/ ID does not exist: Create & Enter');
          putGameToDynamoDB(room, username,
            (putRes) => {
              setTimeout(() => this.swiperRef.scrollBy(1, false), 500);
              debug.log('Put game in DynamoDB!', putRes);
            },
            (exception) => {
              setTimeout(() => this.swiperRef.scrollBy(1, false), 500);
              debug.log('Error putting game in DynamoDB', exception);
            }
          );
        }
      },
      (exception) => {
        // TODO Handle exception
        setTimeout(() => this.swiperRef.scrollBy(-1, false), 500);
        debug.log('Exception getting game from DynamoDB', exception);
      });
  }


  handleBackFromHost() {
    this.swiperRef.scrollBy(-2, false);
  }


  // handleBackFromTeams() {
  //   this.swiperRef.scrollBy(-1, false);
  // }


  handleQuizSelection(e, quiz) {
    const { room } = this.state;

    const teamQuestions = {};
    quiz.questions.forEach((question, idx) => {
      teamQuestions[`team${idx}`] = question;
    });

    const gameState = {
      GameRoomID: room,
      avatar: quiz.avatar,
      title: quiz.description,
      description: quiz.description,
      ...teamQuestions,
      teams: quiz.questions.length,
      answering: null,
    };
    
    this.props.screenProps.handleSetGameState(gameState);
    
    this.props.screenProps.IOTSubscribeToTopic(room);

    // TODO! Handle navigating to Teacher Game Room.

    setTimeout(() => {
      const uid = `${Math.random()}`;
      const data = {
        action: 'SET_GAME_STATE',
        uid,
        gameState,
      };
      const message = JSON.stringify(data);
      this.props.screenProps.IOTPublishMessage(message, uid);
    }, 5000);
  }


  renderQuizBlock(quiz) {
    return (
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.dark, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        key={quiz.title}
        onPress={() => this.handleQuizSelection(null, quiz)}
      >
        <View style={quizStyles.quizButton}>
          <View style={quizStyles.imageContainer}>
            {quiz.image ?
              <Image source={{ uri: quiz.image }} style={quizStyles.image} />
              :
              <Text style={quizStyles.imageLabel}>RightOn!</Text>}
          </View>
          <Text style={quizStyles.quizTitle}>{ quiz.title }</Text>
          <Text style={[quizStyles.quizTitle, quizStyles.quizDescription]}>
            { quiz.description }
          </Text>
          <Text style={quizStyles.quizCount}>{ `${quiz.questions.length}Q` }</Text>
        </View>
      </Touchable>
    );
  }


  // renderNumberBlock = number => (
  //   <Touchable
  //     activeOpacity={0.8}
  //     background={Touchable.Ripple(colors.primary, false)}
  //     key={`${number}`}      
  //     onPress={() => this.handleTeamSelection(number)}
  //     style={styles.blockContainer}
  //   >
  //     <Text style={styles.blockNumber}>{ number }</Text>
  //   </Touchable>
  // );


  // renderNumberBlocks = () => {
  //   const { activeQuiz } = this.state;
  //   if (!activeQuiz.questions) return null;
  //   const len = activeQuiz.questions.length;
  //   const arr = [];
  //   arr[len] = undefined;
  //   return (
  //     <View style={styles.blocksContainer}>
  //       {arr.map((n, idx) => len % idx === 0 && this.renderNumberBlock(idx))}
  //     </View>
  //   );
  // }


  render() {
    const {
      quizzes,
      room,
    } = this.state;

    return (
      <Swiper
        horizontal={false}
        index={0}
        loadMinimal={false}
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
            placeholder={'Game Name'}
            placeholderTextColor={colors.primary} 
            returnKeyType={'done'}
            style={firstStyles.input}
            textAlign={'center'}
            underlineColorAndroid={colors.dark}   
            value={room}
          />
          <ButtonWide
            label={'Enter Game'}
            onPress={this.handleRoomSubmit}
          />
        </View>


        <Portal messageType={'single'} messageValues={{ message: `Launching ${room}` }} />


        <ScrollView contentContainerStyle={[firstStyles.container, styles.scrollview]}>
          <ButtonBack
            onPress={this.handleBackFromHost}
          />
          <Text style={firstStyles.title}>Host a quiz</Text>
          {quizzes.map(quiz => this.renderQuizBlock(quiz))}
        </ScrollView>


        {/* <ScrollView contentContainerStyle={[firstStyles.container, styles.scrollview]}>
          <ButtonBack
            onPress={this.handleBackFromTeams}
          />
          <Text style={firstStyles.title}>Number of Teams</Text>
          {this.renderNumberBlocks()}
          <ButtonWide
            label={'Launch Game'}
            onPress={this.handleTeamSelection}
          />
        </ScrollView> */}


      </Swiper>
    );
  }
}


const styles = StyleSheet.create({
  blockContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: blockSize,
    justifyContent: 'center',
    marginBottom: 15,
    width: blockSize,
  },
  blocksContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  blockNumber: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  scrollview: {
    justifyContent: 'flex-start',
    paddingBottom: 50,
    paddingTop: 90,
  },
});


export default props => <Create screenProps={{ ...props }} />;
