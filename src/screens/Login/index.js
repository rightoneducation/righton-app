import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import LoginSetup from './LoginSetup';
import LoginCode from './LoginCode';
import styles from './styles';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      confirmResult: {},
      screen: 'setup',
    }
    this.passConfirmResultContext = this.passConfirmResultContext.bind(this);
    this.setScreen = this.setScreen.bind(this);
  }

  passConfirmResultContext(context) {
    // Used primarily for iOS devices to confirm result of verification code
    this.setState({ confirmResult: context });
  }

  setScreen(screen) {
    this.setState({ screen });
  }

  render() {
    const { confirmResult, screen } = this.state;
    return (
      <View style={styles.containerMain}>
        <Text style={styles.title}>Right On!</Text>
        { screen === 'setup' && <LoginSetup passConfirmResultContext={this.passConfirmResultContext} setScreen={this.setScreen}/> }
        { screen === 'code' && <LoginCode confirmResult={confirmResult} setScreen={this.setScreen}/> }
      </View>
    )
  }
}

export default Login;