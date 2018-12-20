import React from 'react';
import { ActivityIndicator, Animated, Easing, Keyboard, StyleSheet, Text } from 'react-native';
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


  componentWillReceiveProps(nextProps) {
    if (this.props.activity !== nextProps.activity && nextProps.activity === false) {
      this.animatedRotation = new Animated.Value(0);
      this.setState({ activity: false });
    }
  }


  handleAnimatedPress() {
    Keyboard.dismiss();
    if (this.props.animated) {
      Animated.timing(
        this.animatedRotation, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      ).start(() => {
        this.setState({ activity: true }, () => {
          setTimeout(() => {
            this.props.onPress();
          }, 500);
        });
      });
    } else {
      this.props.onPress();
    }
  }


  render() {
    const { activity } = this.state;

    const { 
      // activity,
      buttonStyles,
      icon,
      iconLabel,
      iconStyles,
      // onPress,
    } = this.props;

    const spin = this.animatedRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <Touchable
        activeOpacity={0.8}
        background={Touchable.Ripple(colors.primary, false)}
        hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
        onPress={this.handleAnimatedPress}
        style={[styles.button, buttonStyles]}
      >
        {
          activity ?
            <ActivityIndicator
              animating={activity}
              color={colors.white}
              size={'small'}
            />
            :
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              {
                iconLabel ?
                  <Text style={[styles.icon, iconStyles]}>{iconLabel}</Text>
                  :
                  <Aicon name={icon} style={[styles.icon, iconStyles]} />
              }
            </Animated.View>
        }
      </Touchable>
    );
  }
}

ButtonRound.propTypes = {
  activity: PropTypes.bool.isRequired,
  animated: PropTypes.bool,
  buttonStyles: PropTypes.shape({}),
  icon: PropTypes.string,
  iconLabel: PropTypes.string,
  iconStyles: PropTypes.shape({}),
  onPress: PropTypes.func.isRequired,
};

ButtonRound.defaultProps = {
  animated: false,
  activity: false,
  buttonStyles: {},
  icon: '',
  iconLabel: '',
  iconStyles: {},
  onPress: () => {},
};


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25,
    bottom: 15,
    elevation: 2,
    height: 45,
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: colors.dark,
    shadowOffset: { height: 1, width: 0 },
    width: 45,
    zIndex: 10,
  },
  icon: {
    color: colors.white,
    fontSize: 20,
  },
});
