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
import QuizBuilder from './QuizBuilder';
import { colors } from '../../../utils/theme';
import debug from '../../../utils/debug';
import styles from './styles';

import LocalStorage from '../../../../lib/Categories/LocalStorage';


class Quizzes extends React.PureComponent {
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
      openQuiz: null,
      quizzes: [],
    };

    this.currentQuiz = null;

    this.handleCloseQuiz = this.handleCloseQuiz.bind(this);
    this.handleCreateQuiz = this.handleCreateQuiz.bind(this);
    this.handleOpenQuiz = this.handleOpenQuiz.bind(this);
  }


  componentDidMount() {
    this.hydrateQuizzes();
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
      // if (__DEV__) {
      //   quizzes = [{ image: '', title: 'Hello world' },
      //     { image: '', title: 'How are you?' },
      //     { image: '', title: 'Take a walk with me!' },
      //     { image: '', title: 'How nice it is today..' },
      //     { image: '', title: 'Like all of future past.' }
      //   ];
      // }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Quizzes, hydrateQuizzes():', exception);
    }
    this.setState({ quizzes });
  }


  handleOpenQuiz(event, quiz = {}, idx) {
    this.currentQuiz = idx;
    this.setState({ openQuiz: quiz });
  }


  handleCloseQuiz() {
    this.setState({ openQuiz: null });
    this.currentQuiz = null;
  }


  handleCreateQuiz(quiz) {
    const { quizzes } = this.state;
    if (this.currentQuiz === null) {
      const updatedQuizzes = [...quizzes, quiz];
      this.setState({ quizzes: updatedQuizzes, openQuiz: null });
      this.saveQuizzesToDatabase(updatedQuizzes);
    } else {
      const updatedQuizzes = [...quizzes];
      updatedQuizzes.splice(this.currentQuiz, 1, quiz);
      this.setState({ quizzes: updatedQuizzes, openQuiz: null });
      this.saveQuizzesToDatabase(updatedQuizzes);
    }
  }


  saveQuizzesToDatabase = (updatedQuizzes) => {
    const stringifyQuizzes = JSON.stringify(updatedQuizzes);
    LocalStorage.setItem('@RightOn:Quizzes', stringifyQuizzes);
  }


  renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Quizzes</Text>
      <Touchable
        activeOpacity={0.8}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        onPress={this.handleOpenQuiz}
        style={styles.plusButton}
      >
        <Aicon name={'plus'} style={styles.plusIcon} />
      </Touchable>
    </View>
  );


  renderQuizBlock(quiz, idx) {
    return (
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.dark, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        key={quiz.title}
        onPress={() => this.handleOpenQuiz(null, quiz, idx)}
      >
        <View style={styles.quizButton}>
          <View style={styles.imageContainer}>
            {quiz.image ?
              <Image source={{ uri: quiz.image }} style={styles.image} />
              :
              <Text style={styles.imageLabel}>RightOn!</Text>}
          </View>
          <Text style={styles.quizTitle}>{quiz.title}</Text>
        </View>
      </Touchable>
    );
  }


  renderQuizzes() {
    const { quizzes } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.scrollview}>
        {quizzes.map((quiz, idx) => this.renderQuizBlock(quiz, idx))}
      </ScrollView>
    );
  }


  render() {
    const { openQuiz } = this.state;
    // const { navigation } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        {openQuiz &&
          <QuizBuilder
            currentQuiz={this.currentQuiz}
            handleClose={this.handleCloseQuiz}
            handleCreateQuiz={this.handleCreateQuiz}
            quiz={openQuiz}
            visible
          />}
        {this.renderHeader()}
        {this.renderQuizzes()}
      </View>
    );
  }
}


export default props => <Quizzes screenProps={{ ...props }} />;
