import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Touchable from 'react-native-platform-touchable';
import { colors, fonts } from '../../utils/theme';


export default function OnboardAppRouter({ navigation, screenProps }) {
  function handleTeacher() {
    screenProps.handleSetAppState('deviceSettings', { role: 'teacher' });
    setTimeout(() => navigation.navigate('OnboardTeacherRouter'), 250);
  }

  function handleStudent() {
    screenProps.handleSetAppState('deviceSettings', { username: `${Math.random()}`, role: 'student' });
    setTimeout(() => navigation.navigate('StudentFirst'), 250);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>RightOn!</Text>
      
      <View style={styles.iamaButtonsContainer}>
        <Touchable
          activeOpacity={0.8}
          background={Touchable.Ripple(colors.primary, false)}
          onPress={handleTeacher}
          style={[styles.iamaButton, styles.whiteBackground]}
        >
          <View style={styles.iamaView}>
            <Text style={[styles.iama, styles.primaryColor]}>I am a</Text>
            <Text style={[styles.role, styles.primaryColor]}>Teacher</Text>
          </View>
        </Touchable>
        <Touchable
          activeOpacity={0.8}
          background={Touchable.Ripple(colors.primary, false)}
          onPress={handleStudent}
          style={[styles.iamaButton, styles.primaryBackground]}
        >
          <View style={styles.iamaView}>
            <Text style={styles.iama}>I am a</Text>
            <Text style={styles.role}>Student</Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
}

OnboardAppRouter.propTypes = {
  onboardNavigator: PropTypes.shape({ type: PropTypes.func }),
  screenProps: PropTypes.shape({
    handleSetAppState: PropTypes.func,
  }),
};

OnboardAppRouter.defaultProps = {
  onboardNavigator: {},
  screenProps: {
    handleSetAppState: () => {},
  },
};

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  iama: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  iamaButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    flex: 0.5,
    marginHorizontal: '5@s',
    paddingVertical: '25@vs',
  },
  iamaButtonsContainer: {
    bottom: '15@vs',
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
  },
  iamaView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    color: colors.white,
    fontSize: fonts.large,
  },
  primaryBackground: {
    backgroundColor: colors.primary,
  },
  primaryColor: {
    color: colors.primary,
  },
  role: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  whiteBackground: {
    backgroundColor: colors.white,
  },
});
