import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { colors, fonts } from '../../../utils/common';

class OnboardIntroComponent extends React.PureComponent {
  constructor() {
    super();
    this.state = {

    }
  }
  
  render() {
    const { handleStart, image, title, startButton, subtitle } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{ title }</Text>
          <Text style={styles.subtitle}>{ subtitle }</Text>
        </View>
        <Image source={ {uri: image} } style={styles.image}/>
        {
          startButton &&
          <Touchable
            activeOpacity={.8}
            background={Touchable.Ripple(colors.black, false)}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={handleStart}
            style={styles.startContainer}
          >
            <Text style={styles.start}>GET STARTED</Text>
          </Touchable>
        }
      </View>
    )
  }
}

OnboardIntroComponent.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  handleStart: PropTypes.func,
  startButton: PropTypes.bool,
};

OnboardIntroComponent.defaultProps = {
  title: '',
  image: '',
  subtitle: '',
  handleStart: function() {},
  startButton: false,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  start: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  startContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: 100,
    borderWidth: 1,
    bottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute',
    zIndex: 100,
  },
  subtitle: {
    color: colors.black,
    fontSize: fonts.medium,
    marginTop: 10,
  },
  textContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 65,
  },
  title: {
    color: colors.black,
    fontSize: fonts.large,
  },
});

export default OnboardIntroComponent;