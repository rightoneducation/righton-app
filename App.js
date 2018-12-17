import Buffer from 'buffer';

global.Buffer = global.Buffer || Buffer.Buffer; // Required for aws sigv4 signing

import React from 'react';
import { YellowBox } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { WithAuth } from './lib/Categories/Auth/Components';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
import OnboardApp from './src/screens/OnboardApp';
import Splash from './src/screens/Splash';
import StudentApp from './src/Student';
import TeacherApp from './src/Teacher';


YellowBox.ignoreWarnings([]);
YellowBox.ignoreWarnings(
  [
    'Module RNFetchBlob requires main queue setup', 
  ]
);


Amplify.configure(awsmobile);


const App = StackNavigator({
  Splash: {
    screen: props => (
      <Splash navigation={props.navigation} {...props.screenProps} />
    ),
    navigationOptions: {
      header: null,
    },
  },
  OnboardApp: {
    screen: props => (
      <OnboardApp rootNavigator={props.navigation} {...props} />
    ), 
    navigationOptions: { 
      header: null,
    },
  },
  StudentApp: {
    screen: props => (
      <StudentApp rootNavigator={props.navigation} {...props} />
    ), 
    navigationOptions: { 
      header: null,
    },
  },
  TeacherApp: {
    screen: props => (
      <TeacherApp rootNavigator={props.navigation} {...props} />
    ), 
    navigationOptions: { 
      header: null,
    },
  },
}, { initialRouteName: 'Splash' });

const AppContainer = props => <App screenProps={{ ...props }} />;

export default WithAuth(AppContainer);
