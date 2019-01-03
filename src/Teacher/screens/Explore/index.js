import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, elevation, fonts } from '../../../utils/theme';


class Explore extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      handleSetRole: PropTypes.func.isRequired,
      navigation: PropTypes.shape({
        navigate: PropTypes.func,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      handleSetRole: () => {},
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
    this.props.screenProps.handleSetRole('Teacher');
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
        {data.banner &&
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


const styles = StyleSheet.create({
  banner: {
    height: 200,
    width: deviceWidth - 30,
  },
  container: {
    flex: 1,
  },
  dataBody: { 
    flex: 1,
    flexDirection: 'row',
    height: 100,
  },
  dataContainer: {
    flexDirection: 'row',
    height: 100,
  },
  dataTextContainer: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'space-around',
    padding: 10,
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
    height: 65,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerProfileContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    height: 40,
    justifyContent: 'flex-end',
    width: 40,
  },
  headerProfileIcon: {
    color: colors.dark,
    fontSize: 30,
    marginTop: 3,
  },
  headerSearchIcon: {
    color: colors.white,
    fontSize: 28,
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    fontStyle: 'italic',
  },
  icon: {
    color: colors.white,
    fontSize: 35,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: 100,
    justifyContent: 'center',
    width: 100,
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
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
});


export default Explore;
