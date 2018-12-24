import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonWide from '../../components/ButtonWide';
import { colors, fonts } from '../../utils/theme';
import OnboardTeacherIntroSlides from '../OnboardTeacherIntroSlides';

export default class OnboardTeacherRouter extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func }),
  }
  
  static defaultProps = {
    navigation: {},
  }
  
  constructor(props) {
    super(props);
    
    this.handleTeacherApp = this.handleTeacherApp.bind(this);
    this.handleTeacherOnboard = this.handleTeacherOnboard.bind(this);
  }


  handleTeacherOnboard() { 
    this.props.navigation.navigate('TeacherFirst');
  }


  handleTeacherApp() {
    this.props.navigation.navigate('TeacherApp');
  }


  render() {
    return (
      <View style={styles.mainContainer}>

        <OnboardTeacherIntroSlides />
        
        <ButtonWide
          buttonStyles={{ bottom: 65 }}
          label={'Sign Up / Sign In'}
          onPress={this.handleTeacherOnboard}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handleTeacherApp}
          style={styles.maybeContainer}
        >
          <Text style={styles.maybe}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.dark,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  maybe: {
    color: colors.white,
    fontSize: fonts.medium,
    textAlign: 'center',
  },
  maybeContainer: {
    // Removing background color causes Swiper dot primary color to shine through
    backgroundColor: colors.dark,
    bottom: 20,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
