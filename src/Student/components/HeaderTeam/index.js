import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../../utils/theme';

export default function HeaderSimple({ team }) {
  return (
    <View style={[styles.container, Platform.OS === 'ios' ? styles.iosContainer : styles.androidContainer]}>
      <Text style={styles.team}>{ team }</Text>
      <Text style={styles.team}>RIGHT ON!</Text>
    </View>
  );
}

HeaderSimple.propTypes = {
  team: PropTypes.string,
};

HeaderSimple.defaultProps = {
  team: '',
};

const styles = StyleSheet.create({
  androidContainer: {
    alignItems: 'center',
  },
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 45,
  },
  iosContainer: {
    alignItems: 'flex-end',
    paddingTop: 15,
  },
  team: {
    color: colors.white,
    fontSize: fonts.medium,
  },
});
