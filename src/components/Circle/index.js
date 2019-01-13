import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';


export default function Circle(props) {
  return (
    <View style={[styles.circle, props.styles]} />
  );
}

Circle.propTypes = {
  styles: PropTypes.shape({ type: PropTypes.string }),
};

Circle.defaultProps = {
  styles: {},
};

const styles = StyleSheet.create({
  circle: {
    // width: 100, // Passed in via props
    // height: 100,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderRadius: 10000, // Defaults to half of width & height
    borderWidth: 1,
    position: 'absolute',
    zIndex: 1,
  },
});
