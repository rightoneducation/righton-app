import React, { PureComponent } from 'react';
import { 
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Touchable from 'react-native-platform-touchable';
import { GradCap } from '../../assets/images';
import { colors, fonts } from '../../utils/common';


class OnboardIntroSlides extends PureComponent {

  constructor(props) {
    super(props);

    this.swiper;

    this.state = {
      startButton: true,
    };

    this.onIndexChanged = this.onIndexChanged.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }



  onIndexChanged(index) {
    if (index !== 1) {

      this.setState({ startButton: false });

    } else {

      if (!this.state.startButton) {
        this.setState({ startButton: true });
      }

    }
  }



  handleStart() {
    this._navigateTo('Login');
  }



  _navigateTo(routeName) {
    this.props.navigation.navigate(routeName);
  }



  render() {
    const { startButton } = this.state;

    return (
      <Swiper
        activeDotColor={'#000'}
        horizontal={true}
        index={0}
        loadMinimal={false}
        loop={false}
        onIndexChanged={this.onIndexChanged}
        ref={ref => this.swiper = ref}
        showsPagination={!startButton}
      >

        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>RightOn</Text>
            <Text style={styles.subtitle}>Learn how to play to learn</Text>
          </View>
          <Image source={ {uri: GradCap} } style={styles.image}/>
        </View>


        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>RightOn</Text>
            <Text style={styles.subtitle}>Learn how to play to learn</Text>
          </View>
          <Image source={ {uri: GradCap} } style={styles.image}/>
          {
            startButton &&
            <Touchable
              activeOpacity={.8}
              background={Touchable.Ripple(colors.black, false)}
              hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
              onPress={this.handleStart}
              style={styles.startContainer}
            >
              <Text style={styles.start}>GET STARTED</Text>
            </Touchable>
          }
        </View>

      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  start: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  startContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: 100,
    borderWidth: 1,
    bottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute',
    zIndex: 100,
  },
  subtitle: {
    color: colors.white,
    fontSize: fonts.medium,
    marginTop: 10,
  },
  textContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 65,
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
});

export default OnboardIntroSlides;