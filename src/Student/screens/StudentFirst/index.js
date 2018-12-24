import React from 'react';
import Swiper from 'react-native-swiper';
import AgeInput from './StudentFirstAgeInput';
import GameRoom from './StudentFirstGameRoom';


export default class StudentFirst extends React.Component {
  constructor(props) {
    super(props);

    this.swiper = undefined;

    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
  }


  handleRoomSubmit() {
    this.props.navigation.navigate('StudentApp');
  }


  render() {
    const { navigation } = this.props;
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
        <AgeInput navigation={navigation} handleAgeSubmit={() => this.swiper.scrollBy(1, false)} />
        <GameRoom navigation={navigation} handleRoomSubmit={this.handleRoomSubmit} />
      </Swiper>
    );
  }
}
