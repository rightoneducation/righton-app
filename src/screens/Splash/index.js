import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Splash = () => (
  <View style={styles.container}>
    <Text style={styles.logo}>Right On!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    color: '#000',    
    fontSize: 35,
    fontStyle: 'italic',
  },
});

export default Splash;