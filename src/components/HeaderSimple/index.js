import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../utils/theme';

export default function HeaderSimple({ title }) {
  return (
    <View style={styles.container}>
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
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.black,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
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
