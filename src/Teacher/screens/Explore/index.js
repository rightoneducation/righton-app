import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { scale, ScaledSheet } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, elevation, fonts } from '../../../utils/theme';


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
    };
  }


  componentDidMount() {
    if (__DEV__) this.hydrateDummyData();
  }


  hydrateDummyData() {
    this.setState({
      data: [
        {
          icon: '',
          banner: '',
          title: 'Triangles or try angles',
          description: 'A guide up the pyramids',
        },
      ],
    });
  }


  hydrateState(data, extraData) {
    if (extraData) {
      this.setState({ data: [...data, ...extraData] });
    } else {
      this.setState({ data });
    }
  }


  renderHeader = () => (
    <View style={[styles.headerContainer, elevation]}>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
        style={styles.headerProfileContainer}
      >
        <Aicon name={'user'} style={styles.headerProfileIcon} />
      </Touchable>
      <Text style={styles.headerTitle}>RightOn!</Text>
      <Touchable
        activeOpacity={0.8}
        onPress={() => { /* TODO */ }}
      >
        <Aicon name={'search'} style={styles.headerSearchIcon} />
      </Touchable>
    </View>
  );


  renderDataBlock = data => (
    <Touchable
      activeOpacity={0.8}
      key={data.title || data.description}
      onPress={() => {}}
    >
      <View style={[styles.dataContainer, data.banner && { flexDirection: 'column', height: 300 }]}>
        {Boolean(data.banner) &&
          <Image source={{ uri: data.banner }} style={styles.banner} />}
        <View style={styles.dataBody}>
          <View style={styles.iconContainer}>
            {data.icon ?
              <Aicon name={data.icon} style={styles.icon} /> :
              <View style={styles.iconTextContainer}>
                <Text style={styles.iconText}>RightOn!</Text>
              </View>}
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
      data
    } = this.state;

    // const { navigation } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} />
        {this.renderHeader()}
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
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderColor: colors.dark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: '65@vs',
    justifyContent: 'space-between',
    paddingHorizontal: '15@s',
  },
  headerProfileContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 100,
    height: '40@ms',
    justifyContent: 'flex-end',
    width: '40@ms',
  },
  headerProfileIcon: {
    color: colors.dark,
    fontSize: '30@ms0.2',
    marginTop: '3@vs',
  },
  headerSearchIcon: {
    color: colors.white,
    fontSize: '28@ms0.2',
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    fontStyle: 'italic',
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
