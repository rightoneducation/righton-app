import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../utils/theme';

export default function HeaderSimple({ title }) {
  return (
    <View style={[styles.container, Platform.OS === 'ios' ? styles.iosContainer : styles.androidContainer]}>
      <Text style={styles.title}>{ title }</Text>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>?</Text>
      </View>
    </View>
  );
}

HeaderSimple.propTypes = {
  title: PropTypes.string,
};

HeaderSimple.defaultProps = {
  title: 'RIGHT ON!',
};

const styles = StyleSheet.create({
  androidContainer: {
    alignItems: 'center',
  },
  container: {
    alignSelf: 'stretch',
    backgroundColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 45,
  },
  iosContainer: {
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  logo: {
    color: colors.white,
    fontSize: fonts.small,
  },
  logoContainer: {
    alignItems: 'center',
    borderColor: colors.white,
    borderWidth: 0.5,
    borderRadius: 13,
    height: 25,
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    width: 25,
  },
  title: {
    color: colors.white,
    fontSize: fonts.medium,
  },
});
