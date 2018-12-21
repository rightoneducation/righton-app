import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, fonts } from '../../../utils/theme';
import debug from '../../../utils/debug';

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


  handleOpenQuiz(quiz) {
    this.setState({ openQuiz: quiz });
  }


  handleCloseQuiz() {
    this.setState({ openQuiz: null });
  }


  renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Quizzes</Text>
    </View>
  );


  renderQuizBlock(quiz) {
    return (
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.dark, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        key={quiz.title}
        onPress={() => this.handleOpenQuiz(quiz)}
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
    // const {

    // } = this.state;

    // const { navigation } = this.props.screenProps;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderQuizzes()}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  header: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    height: 200,
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    marginTop: 50,
    textAlign: 'center',
  },
  image: {
    height: 150,
    width: 150,
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  imageLabel: {
    color: colors.dark,
    fontSize: fonts.small,
    fontStyle: 'italic',
  },
  quizButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 150,
    marginHorizontal: 15,
    marginVertical: 10,
    width: deviceWidth - 30,
  },
  quizTitle: {
    color: colors.dark,
    fontSize: fonts.medium,
    padding: 10
  },
  scrollview: {
    flexGrow: 1,
    marginTop: 15,
    paddingBottom: 25,
  },
});


export default props => <Quizzes screenProps={{ ...props }} />;
