import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, fonts } from '../../utils/theme';

export default class ButtonBack extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }


  handlePress() {
    Keyboard.dismiss();
    if (this.props.onPress) {
      this.props.onPress();
    } else {
      this.props.navigator.goBack();
    }
  }


  render() {
    const {
      buttonStyles,
      // navigator,
      // onPress,
    } = this.props;

    return (
      <Touchable
        activeOpacity={.8}
        hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
        onPress={this.handlePress}
        style={[styles.button, { ...buttonStyles }]}
      >
        <Aicon name={'arrow-left'} style={styles.icon} />
      </Touchable>
    );
  }
}

ButtonBack.propTypes = {
  buttonStyles: PropTypes.object,
  navigator: PropTypes.object,
  onPress: PropTypes.func,
};

ButtonBack.defaultProps = {
  buttonStyles: {},
  navigator: {},
  onPress: null,
};


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 15,
    top: 25,
    zIndex: 10,
  },
  icon: {
    color: colors.white,
    fontSize: 20,
  },
});