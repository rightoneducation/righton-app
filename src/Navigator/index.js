import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import OnboardApp from '../screens/OnboardApp';
import Splash from '../screens/Splash';
import StudentApp from '../Student';
import TeacherApp from '../Teacher';


const RootNavigator = createStackNavigator({
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


const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
