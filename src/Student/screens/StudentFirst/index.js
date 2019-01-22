import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import AgeInput from './StudentFirstAgeInput';
import GameRoom from './StudentFirstGameRoom';


export default class StudentFirst extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }),
    screenProps: PropTypes.shape({
      handleSetAppState: PropTypes.func.isRequired,
    }),
  }

  
  static defaultProps = {
    navigation: {
      navigate: () => {},
    },
    screenProps: {
      handleSetAppState: () => {},
    },
  }

  constructor(props) {
    super(props);

    this.swiper = undefined;

    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    this.handleNavigateToOnboardApp = this.handleNavigateToOnboardApp.bind(this);
    this.handleSwipeToAge = this.handleSwipeToAge.bind(this);
    this.handleAgeSubmit = this.handleAgeSubmit.bind(this);
  }


  handleRoomSubmit(room) {
    if (room) {
      this.props.navigation.navigate('StudentApp', { GameRoomID: room });
    } else {
      this.props.navigation.navigate('StudentApp');
    }
  }


  handleSwipeToAge() {
    this.swiper.scrollBy(-1, false);
  }


  handleAgeSubmit(age) {
    const { handleSetAppState } = this.props.screenProps;
    handleSetAppState('deviceSettings', { age });
    this.swiper.scrollBy(1, false);
  }


  handleNavigateToOnboardApp() {
    this.props.navigation.navigate('OnboardAppRouter');
  }


  render() {
    return (
      <Swiper
        horizontal
        index={0}
        loadMinimal={false}
        loop={false}
        ref={(ref) => { this.swiper = ref; }}
        scrollEnabled={false}
        showsPagination={false}
      >
        <AgeInput
          screenProps={{
            handleAgeSubmit: this.handleAgeSubmit,
            handleBack: this.handleNavigateToOnboardApp,
            handleSetAppState: this.props.screenProps.handleSetAppState,
          }}
        />
        <GameRoom
          screenProps={{
            handleRoomSubmit: this.handleRoomSubmit,
            handleBack: this.handleSwipeToAge,
            handleSetAppState: this.props.screenProps.handleSetAppState,
          }}
        />
      </Swiper>
    );
  }
}
