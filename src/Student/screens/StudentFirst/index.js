import React from 'react';
import Swiper from 'react-native-swiper';
import AgeInput from './StudentFirstAgeInput';
import GameRoom from './StudentFirstGameRoom';


export default class StudentFirst extends React.Component {
  constructor(props) {
    super(props);

    this.swiper = undefined;

    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    this.handleNavigateToOnboardApp = this.handleNavigateToOnboardApp.bind(this);
    this.handleSwipeToAge = this.handleSwipeToAge.bind(this);
    this.handleSwipeToRoom = this.handleSwipeToRoom.bind(this);
  }


  handleRoomSubmit() {
    this.props.navigation.navigate('StudentApp');
  }


  handleSwipeToAge() {
    this.swiper.scrollBy(-1, false);
  }


  handleSwipeToRoom() {
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
            handleAgeSubmit: this.handleSwipeToRoom,
            handleBack: this.handleNavigateToOnboardApp,
          }}
        />
        <GameRoom
          screenProps={{
            handleRoomSubmit: this.handleRoomSubmit,
            handleBack: this.handleSwipeToAge,
          }}
        />
      </Swiper>
    );
  }
}
