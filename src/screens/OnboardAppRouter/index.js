import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { colors, fonts } from '../../utils/theme';


export default OnboardAppRouter = ({ onboardNavigator }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>RightOn!</Text>
      <View style={styles.iamaButtonsContainer}>
        <Touchable
          activeOpacity={.8}
          background={Touchable.Ripple(colors.primary, false)}
          onPress={() => onboardNavigator.navigate('TeacherFirst')}
          style={[styles.iamaButton, styles.whiteBackground]}
        >
          <View style={styles.iamaView}>
            <Text style={[styles.iama, styles.primaryColor]}>I am a</Text>
            <Text style={[styles.role, styles.primaryColor]}>Teacher</Text>
          </View>
        </Touchable>
        <Touchable
          activeOpacity={.8}
          background={Touchable.Ripple(colors.primary, false)}
          onPress={() => onboardNavigator.navigate('StudentFirst')}
          style={[styles.iamaButton, styles.primaryBackground]}
        >
          <View style={styles.iamaView}>
            <Text style={styles.iama}>I am a</Text>
            <Text style={styles.role}>Student</Text>
          </View>
        </Touchable>
      </View>
    </View>
  )
}

OnboardAppRouter.propTypes = {
  onboardNavigator: PropTypes.object.isRequired,
};

OnboardAppRouter.defaultProps = {
  onboardNavigator: {},
};

const styles = StyleSheet.create({
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
    flex: .5,
    marginHorizontal: 5,
    paddingVertical: 25,
  },
  iamaButtonsContainer: {
    bottom: 15,
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