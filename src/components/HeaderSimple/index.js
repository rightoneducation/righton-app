import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../utils/theme';

const HeaderSimple = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{ title }</Text>
    <View style={styles.logoContainer}>
      <Text style={styles.logo} />
    </View>
  </View>
);

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
    backgroundColor: colors.dark,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
  },
  logo: {
    color: colors.white,
    fontSize: fonts.small,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: 18,
    height: 35,
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    width: 35,
  },
  title: {
    color: colors.white,
    fontSize: fonts.medium,
  },
});

export default HeaderSimple;