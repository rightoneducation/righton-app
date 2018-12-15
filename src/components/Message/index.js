import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { colors, fonts } from '../../utils/theme';

export default class Message extends React.Component {
  constructor() { 
    super();
    this.opacity = new Animated.Value(0);
    this.timeout;
    this.handleTouchClose = this.handleTouchClose.bind(this);
  }

  render() {
    const {
      // closeFunc,
      bodyStyle,
      textStyle,
      // duration,
      message,
      // timeout,
    } = this.props;

    return (
      <Animated.View style={[{ opacity: this.opacity }, styles.container, bodyStyle]}>
        <Touchable
          activeOpacity={.8}
          background={Touchable.Ripple(colors.dark, false)}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
          onPress={this.handleTouchClose}
        >
          <Text style={[styles.message, textStyle]}>{ message }</Text>
        </Touchable>
      </Animated.View>
    )
  }

  componentDidMount() {
    const { duration, timeout } = this.props;
    Animated.timing(
      this.opacity, {
        duration: duration ? duration : 1500,
        toValue: 1,
        useNativeDriver: true,
      }
    ).start();
    this.timeout = setTimeout(() => {
      this.handleTouchClose();
    }, timeout ? timeout : 5500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleTouchClose() {
    const { closeFunc } = this.props;
    Animated.timing(
      this.opacity, {
        duration: 500,
        toValue: 0,
        useNativeDriver: true,
      }
    ).start(() => {
      closeFunc();
    });
  }
}

Message.propTypes = {
  closeFunc: PropTypes.func.isRequired,
  bodyStyle: PropTypes.object,
  textStyle: PropTypes.object,
  duration: PropTypes.number,
  message: PropTypes.string.isRequired,
  timeout: PropTypes.number,
};

Message.defaultProps = {
  closeFunc: () => {},
  bodyStyle: {},
  textStyle: {},
  duration: 0,
  message: '',
  timeout: 0,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.darkGray,
    borderRadius: 100,
    bottom: 40,
    justifyContent: 'center',
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute',
    zIndex: 10,
  },
  message: {
    color: colors.white,
    fontSize: fonts.small,
    textAlign: 'center',
  },
});