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
      quizRenderer: [],
    };

    this.quizzes = [];

    this.handleCloseQuiz = this.handleCloseQuiz.bind(this);
    this.handleOpenQuiz = this.handleOpenQuiz.bind(this);
  }


  componentDidMount() {
    this.hydrateQuizzes();
  }
  
  
  async hydrateQuizzes() {
    try {
      this.quizzes = await LocalStorage.getItem('@RightOn:Quizzes');
      if (this.quizzes === undefined) {
        LocalStorage.setItem('@RightOn:Quizzes', JSON.stringify([]));
        this.quizzes = [];
      }
      if (__DEV__) {
        this.quizzes = [{ image: '', title: 'Hello world' }, { image: '', title: 'How are you?' }, { image: '', title: 'Take a walk with me!' }, { image: '', title: 'How nice it is today..' }, { image: '', title: 'Like all of future past.' }];
      }
    } catch (exception) {
      debug.log('Caught exception getting item from LocalStorage @Quizzes, hydrateQuizzes():', exception);
    }
  
    const quizRenderer = [];
    for (let i = 0; i < this.quizzes.length; i += 1) {
      quizRenderer.push(this.renderQuizBlock(this.quizzes[i]));
    }
    this.setState({ quizRenderer });
  }


  handleOpenQuiz(event, quiz = {}) {
    this.setState({ openQuiz: quiz });
  }


  handleCloseQuiz() {
    this.setState({ openQuiz: null });
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


  renderQuizBlock(quiz) {
    return (
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.dark, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        key={quiz.title}
        onPress={() => this.handleOpenQuiz(null, quiz)}
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
    const { quizRenderer } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.scrollview}>
        {quizRenderer}
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
            handleClose={this.handleCloseQuiz}
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
