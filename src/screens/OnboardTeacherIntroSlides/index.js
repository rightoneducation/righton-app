import React from 'react';
import { 
  Image,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Swiper from 'react-native-swiper';
import { GradCap } from '../../assets/images';
import { colors, fonts } from '../../utils/theme';


export default class OnboardIntroSlides extends React.PureComponent {
  static propTypes = {
    rootNavigator: PropTypes.shape({
      navigate: PropTypes.func
    }),
  }

  static defaultProps = {
    rootNavigator: {},
  }

  constructor(props) {
    super(props);

    this.swiper = undefined;
    
    // this.state = {
    //   startButton: true,
    // };

    // this.onIndexChanged = this.onIndexChanged.bind(this);
    // this.handleStart = this.handleStart.bind(this);
  }


  // onIndexChanged(index) {
  //   if (index !== 1) {
  //     this.setState({ startButton: false });
  //   } else if (!this.state.startButton) {
  //     this.setState({ startButton: true });
  //   }
  // }


  // handleStart() {
  //   this.navigateTo('First');
  // }


  // navigateTo(routeName) {
  //   this.props.navigation.navigate(routeName);
  // }


  render() {
    // const { startButton } = this.state;

    return (
      <Swiper
        activeDotColor={colors.primary}
        horizontal
        index={0}
        loadMinimal={false}
        loop={false}
        onIndexChanged={this.onIndexChanged}
        ref={(ref) => { this.swiper = ref; }}
        showsPagination
      >

        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>RightOn</Text>
            <Text style={styles.subtitle}>Engage Students at all levels</Text>
          </View>
          <Image source={{ uri: GradCap }} style={styles.image} />
        </View>


        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>RightOn</Text>
            <Text style={styles.subtitle}>
              Foster a culture of error where mistakes are both expected and respected
            </Text>
          </View>
          <Image source={{ uri: GradCap }} style={styles.image} />
          {/* {
            startButton &&
            <Touchable
              activeOpacity={0.8}
              background={Touchable.Ripple(colors.black, false)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={this.handleStart}
              style={styles.startContainer}
            >
              <Text style={styles.start}>GET STARTED</Text>
            </Touchable>
          } */}
        </View>

        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>RightOn</Text>
            <Text style={styles.subtitle}>
              Create better quizzes faster
            </Text>
          </View>
          <Image source={{ uri: GradCap }} style={styles.image} />
        </View>

        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>RightOn</Text>
            <Text style={styles.subtitle}>
              Reduce time grading, increase time engaging!
            </Text>
          </View>
          <Image source={{ uri: GradCap }} style={styles.image} />
        </View>

      </Swiper>
    );
  }
}

const styles = ScaledSheet.create({
  accountCheck: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  accountLogin: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  bottomContainer: {
    alignItems: 'center',
    bottom: '35@vs',
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  // start: {
  //   color: colors.white,
  //   fontSize: fonts.medium,
  // },
  // startContainer: {
  //   alignItems: 'center',
  //   backgroundColor: colors.primary,
  //   borderColor: colors.grey,
  //   borderRadius: 100,
  //   borderWidth: 1,
  //   bottom: 15,
  //   justifyContent: 'center',
  //   paddingHorizontal: 15,
  //   paddingVertical: 10,
  //   position: 'absolute',
  //   zIndex: 100,
  // },
  subtitle: {
    color: colors.white,
    fontSize: fonts.medium,
    marginTop: '10@vs',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: '20@s',
    position: 'absolute',
    top: '65@vs',
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
});
