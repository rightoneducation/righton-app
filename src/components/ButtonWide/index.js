import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { colors, deviceWidth, fonts } from '../../utils/theme';

export default class ButtonWide extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }


  handlePress() {
    Keyboard.dismiss();
    this.props.onPress();
  }


  render() {
    const { 
      // onPress,
      label,
    } = this.props;

    return (
      <Touchable
        activeOpacity={.8}
        background={Touchable.Ripple(colors.primary, false)}
        hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
        onPress={this.handlePress}
        style={styles.button}
      >
        <Text style={styles.label}>{ label ? label : 'Okay' }</Text>
      </Touchable>
    );
  }
}

ButtonWide.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

ButtonWide.defaultProps = {
  label: '',
  onPress: () => {},
};


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 100,
    bottom: 15,
    height: 65,
    justifyContent: 'center',
    position: 'absolute',
    width: deviceWidth - 75,
    zIndex: 10,
  },
  label: {
    color: colors.white,
    fontSize: fonts.medium,
  },
});