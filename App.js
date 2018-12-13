global.Buffer = global.Buffer || require('buffer').Buffer; // Required for aws sigv4 signing

import React from 'react';
import { DrawerNavigator } from 'react-navigation';

import { WithAuth } from './lib/Categories/Auth/Components';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
import OnboardApp from './src/screens/OnboardApp';
import OnboardIntroSlides from './src/screens/OnboardIntroSlides';
import Splash from './src/screens/Splash';

Amplify.configure(awsmobile);

const App = DrawerNavigator({
  Splash: {
    screen: (props) => {
      return <Splash navigation={props.navigation} { ...props.screenProps } />;
    },
    navigationOptions: {
      drawerLabel: ' ',
    },
  },
  OnboardApp: {
    screen: (props) => {
      return <OnboardApp rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      drawerLabel: ' ',
    },
  },
  OnboardIntroSlides: {
    screen: (props) => {
      return <OnboardIntroSlides rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      drawerLabel: ' ',
    },
  },
}, { initialRouteName: 'Splash' });

const AppContainer = props => <App screenProps={{ ...props }} />;

export default WithAuth(AppContainer);
