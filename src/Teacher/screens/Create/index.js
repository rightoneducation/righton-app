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
import { API } from 'aws-amplify';
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
      activeQuiz: {},
      room: '',
      quizzes: [],
    };

    this.handleRoomInput = this.handleRoomInput.bind(this);
    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    this.handleGroupSelection = this.handleGroupSelection.bind(this);

    this.handleBackFromGroups = this.handleBackFromGroups.bind(this);
    this.handleBackFromHost = this.handleBackFromHost.bind(this);
  }


  handleRoomInput(room) {
    this.setState({ room });
  }


  async hydrateQuizzes() {
    let quizzes;
    try {
      quizzes = await LocalStorage.getItem('@RightOn:Quizzes');
      if (quizzes === undefined) {
        LocalStorage.setItem('@RightOn:Quizzes', JSON.stringify([]));
        // TODO! Handle when user is logged in with different account??
        quizzes = [];
      } else {
        quizzes = JSON.parse(quizzes);
      }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Quizzes, hydrateQuizzes():', exception);
    }
    this.setState({ quizzes }, () => {
      setTimeout(() => this.swiperRef.scrollBy(1, false), 500);
    });
  }


  handleRoomSubmit() {
    // TODO Handle entering game in DynamoDB
    // Hydrate Dashboard w/ game details
    this.hydrateQuizzes();
    this.swiperRef.scrollBy(1, false);
  }


  handleBackFromHost() {
    this.swiperRef.scrollBy(-2, false);
  }


  handleBackFromGroups() {
    this.swiperRef.scrollBy(-1, false);
  }


  handleQuizSelection(e, quiz) {
    this.setState({ activeQuiz: quiz });
    this.swiperRef.scrollBy(1, false);
  }


  removeEmptyStringElements = (obj) => {
    const refObj = obj;
    const arr = Object.keys(refObj);
    for (let i = 0; i < arr.length; i += 1) {
      if (typeof refObj[arr[i]] === 'object') { // dive deeper in
        this.removeEmptyStringElements(refObj[arr[i]]);
      } else if (refObj[arr[i]] === '') { // delete elements that are empty strings
        delete refObj[arr[i]];
      }
    }
    return refObj;
  }


  async handleGroupSelection(number) {
    const { activeQuiz, room } = this.state;
    const parsedQuiz = this.removeEmptyStringElements(activeQuiz);
    const awsQuiz = {
      ...parsedQuiz,
      GameRoomID: room,
      groups: number,
      answering: null,
    };
    // const schema = {
    //   avatar: 'string',
    //   title: 'string',
    //   description: 'string',
    //   questions: [{
    //     answer: 'string',
    //     image: 'string',
    //     instructions: ['string'],
    //     question: 'string',
    //     uid: 'string',
    //     group: 'number',
    //     tricks: ['string'],
    //   }],
    //   GameRoomID: 'string',
    //   groups: 'number',
    //   answering: 'number', // index of quiz in questions array
    // };

    try {
      const apiName = 'TeacherGameAPI'; // replace this with your api name.
      const path = '/GameRoomID'; // replace this with the path you have configured on your API
      const myInit = {
        body: awsQuiz, // replace this with attributes you need
        headers: {} // OPTIONAL
      };

      API.post(apiName, path, myInit).then((response) => {
        console.log('Response from posting quiz: ', response);
      }).catch((error) => {
        console.log('Error from posting quiz:', error);
      });
    } catch (exception) {
      console.log('Error putting awsQuiz into DynamoDB:', exception);
    }
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


  renderNumberBlock = number => (
    <Touchable
      activeOpacity={0.8}
      background={Touchable.Ripple(colors.primary, false)}
      key={`${number}`}      
      onPress={() => this.handleGroupSelection(number)}
      style={styles.blockContainer}
    >
      <Text style={styles.blockNumber}>{ number }</Text>
    </Touchable>
  );


  renderNumberBlocks = () => (
    <View style={styles.blocksContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(number => this.renderNumberBlock(number))}
    </View>
  );


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


        <ScrollView contentContainerStyle={[firstStyles.container, styles.scrollview]}>
          <ButtonBack
            onPress={this.handleBackFromGroups}
          />
          <Text style={firstStyles.title}>Number of groups</Text>
          {this.renderNumberBlocks()}
          <ButtonWide
            label={'Launch Game'}
            onPress={this.handleGroupSelection}
          />
        </ScrollView>


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
