import React, { PureComponent } from 'react';
// import Swiper from 'react-native-swiper';
import OnboardIntroSlide from './OnboardIntroSlide';
import { GradCap } from '../../../assets/images';

class OnboardIntro extends PureComponent {
  constructor() {
    super();
    this.swiper;
    this.state = {
      startButton: true,
    };
    this.onIndexChanged = this.onIndexChanged.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  onIndexChanged(index) {
    if (index === 1) {
      this.setState({ startButton: false });
    } else {
      if (!this.state.startButton) {
        this.setState({ startButton: true });
      }
    }
  }

  handleStart() {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'AppNavigator',
    //     })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
    // setTimeout(() => this.props.navigation.navigate('Dashboard'), 0);
  }

  render() {
    const { startButton } = this.state;

    return (
      // <Swiper
      //   activeDotColor={'#000'}
      //   horizontal={true}
      //   index={0}
      //   loadMinimal={false}
      //   loop={false}
      //   onIndexChanged={this.onIndexChanged}
      //   ref={ref => this.swiper = ref}
      //   showsPagination={!startButton}
      // >
        // <OnboardIntroSlide
        //   image={ GradCap }
        //   title={'Welcome aboard!'}
        //   subtitle={'Learn to play how to play to learn'}
        // />
        <OnboardIntroSlide
          handleStart={this.handleStart}
          image={ GradCap }
          title={'Welcome aboard!'}
          subtitle={'Learn to play how to play to learn'}
          startButton={startButton}
        />
      // </Swiper>
    )
  }
}

export default OnboardIntro;