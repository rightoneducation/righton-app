import React from 'react';
import {StyleSheet, View} from 'react-native';

const Circle = (props) => (
  <View style={[styles.circle, props.styles]}/>
);

const styles = StyleSheet.create({
  circle: {
    // width: 100, // Passed in via props
    // height: 100,
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderRadius: 10000, // Defaults to half of width & height
    borderWidth: 1,
    position: 'absolute',
    zIndex: 1,
  },
});

export default Circle;