global.Buffer = global.Buffer || require('buffer').Buffer; // Required for aws sigv4 signing

import React from 'react';
import { StackNavigator } from 'react-navigation';

import { WithAuth } from './lib/Categories/Auth/Components';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
import OnboardApp from './src/screens/OnboardApp';
import OnboardIntroSlides from './src/screens/OnboardIntroSlides';
import Splash from './src/screens/Splash';
import StudentApp from './src/Student';
import TeacherApp from './src/Teacher';


Amplify.configure(awsmobile);

const App = StackNavigator({
  Splash: {
    screen: (props) => {
      return <Splash navigation={props.navigation} { ...props.screenProps } />;
    },
    navigationOptions: {
      header: null,
    },
  },
  OnboardApp: {
    screen: (props) => {
      return <OnboardApp rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      header: null,
    },
  },
  OnboardIntroSlides: {
    screen: (props) => {
      return <OnboardIntroSlides rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      header: null,
    },
  },
  StudentApp: {
    screen: (props) => {
      return <StudentApp rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      header: null,
    },
  },
  TeacherApp: {
    screen: (props) => {
      return <TeacherApp rootNavigator={props.navigation} {...props} />;
    }, 
    navigationOptions: { 
      header: null,
    },
  },
}, { initialRouteName: 'Splash' });

const AppContainer = props => <App screenProps={{ ...props }} />;

export default WithAuth(AppContainer);
