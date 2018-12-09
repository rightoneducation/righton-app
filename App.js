global.Buffer = global.Buffer || require('buffer').Buffer; // Required for aws sigv4 signing

import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import { WithAuth } from './lib/Categories/Auth/Components';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
import Home from './src/screens/Home';
import OnboardLogin from './src/screens/Onboard/OnboardLogin';
import OnboardIntro from './src/screens/Onboard/OnboardIntro';
import Splash from './src/screens/Splash';

Amplify.configure(awsmobile);

const App = DrawerNavigator({
  Home: {
    screen: (props) => {
      return <Home rootNavigator={props.navigation} {...props.screenProps } />;
    },
  },
  Splash: {
    screen: (props) => {
      return <Splash navigation={props.navigation} { ...props.screenProps } />;
    },
    navigationOptions: {
      drawerLabel: ' ',
    },
  },
  OnboardIntro: {
    screen: (props) => {
      return <OnboardIntro rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      drawerLabel: ' ',
    },
  },
  OnboardLogin: {
    screen: (props) => {
      return <OnboardLogin rootNavigator={props.navigation} screenProps={{ ...props.screenProps }} />;
    },
    navigationOptions: {
      drawerLabel: ' ',
    },
  },
}, { initialRouteName: 'Splash' });

const AppContainer = props => <App screenProps={{ ...props }} />;

export default WithAuth(AppContainer);
