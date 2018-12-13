import React from 'react';
import { ActivityIndicator, Animated, Easing, Keyboard, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors } from '../../utils/theme';

export default class ButtonRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activity: false,
    };

    this.animatedRotation = new Animated.Value(0);

    this.handleAnimatedPress = this.handleAnimatedPress.bind(this);
  }


  handleAnimatedPress() {
    Keyboard.dismiss();
    Animated.timing(
      this.animatedRotation, {
      toValue: 1,
      duration: 250,
      easing: Easing.linear
    }).start(() => {
      this.setState({ activity: true }, () => {
        setTimeout(() => {
          this.props.onPress();
        }, 500);
      });
    });
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.activity !== nextProps.activity && nextProps.activity === false) {
      this.animatedRotation = new Animated.Value(0);
      this.setState({ activity: false });
    }
  }


  render() {
    const { activity } = this.state;

    const { 
      // activity,
      icon, 
      // onPress,
    } = this.props;

    const spin = this.animatedRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '420deg']
    });

    return (
      <Touchable
        activeOpacity={.8}
        background={Touchable.Ripple(colors.primary, false)}
        hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
        onPress={this.handleAnimatedPress}
        style={styles.button}
      >
        {
          activity ?
          <ActivityIndicator
            animating={activity}
            color={colors.white}
            size={'small'}
          />
          :
          <Animated.View style={{transform: [{rotate: spin}] }}>
            <Aicon name={icon} style={styles.icon} />
          </Animated.View>
        }
      </Touchable>
    );
  }
}

ButtonRound.propTypes = {
  activity: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

ButtonRound.defaultProps = {
  activity: false,
  icon: '',
  onPress: () => {},
};


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25,
    bottom: 15,
    height: 45,
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    width: 45,
    zIndex: 10,
  },
  icon: {
    color: colors.white,
    fontSize: 20,
  },
});