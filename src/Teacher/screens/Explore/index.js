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
// import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, fonts } from '../../../utils/theme';
import debug from '../../../utils/debug';
import MainHeader from '../../components/MainHeader';
import GameBuilder from '../Games/GameBuilder';


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
  }


  componentDidMount() {
    if (__DEV__) this.hydrateDummyData();
    this.hydrateGamesFromDynamoDB();
  }


  hydrateDummyData() {
    this.setState({
      data: [
        {
          title: 'Triangles or try angles',
          description: 'A guide up the pyramids',
        },
      ],
    });
  }


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


  handleViewGame(data) {
    const parsedGame = {};
    parsedGame.title = data.title;
    parsedGame.description = data.description;
    parsedGame.category = data.category;
    parsedGame.CCS = data.CCS;
    parsedGame.questions = [];
    let questionIndex = 1;
    while (data[`q${questionIndex}`]) {
      parsedGame.questions.push(data[`q${questionIndex}`]);
      parsedGame.questions[questionIndex - 1].uid = `${Math.random()}`;
      questionIndex += 1;
    }
    this.setState({ viewGame: parsedGame });
  }


  renderDataBlock = data => (
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
          </View>
        </View>
      </View>
    </Touchable>
  );


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
  scrollview: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '25@vs',
  },
});


export default Explore;
