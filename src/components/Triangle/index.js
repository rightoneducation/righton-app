import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Polygon} from 'react-native-svg';

const Triangle = (props) => (
  <View style={[styles.position, props.position]}>
    <Svg height={props.height} width={props.width}>
      <Polygon
        points={props.points}
        fill={'none'}
        stroke={'#fff'}
        strokeWidth={.5}
      />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  position: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
});

export default Triangle;