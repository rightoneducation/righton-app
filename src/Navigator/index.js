import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Splash from '../screens/Splash';
import OnboardAppRouter from '../screens/OnboardAppRouter';
import OnboardTeacherRouter from '../screens/OnboardTeacherRouter';
import StudentFirst from '../Student/screens/StudentFirst';
import TeacherFirst from '../Teacher/screens/TeacherFirst';
import StudentApp from '../Student';
import TeacherApp from '../Teacher';


const RootNavigator = createSwitchNavigator({


  Splash: {
    screen: props => (
      <Splash navigation={props.navigation} {...props.screenProps} />
    ),
    navigationOptions: {
      header: null,
    },
  },


  OnboardAppRouter: {
    screen: props => (
      <OnboardAppRouter navigation={props.navigation} />
    ),
    navigationOptions: {
      header: null,
    },
  },


  OnboardTeacherRouter: {
    screen: (props) => {
      const { navigation, screenProps } = props;

      return (
        <OnboardTeacherRouter navigation={navigation} {...screenProps} />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  TeacherFirst: {
    screen: TeacherFirst,
    navigationOptions: {
      header: null,
    },
  },


  StudentFirst: {
    screen: (props) => {
      const { navigation, screenProps, ...otherProps } = props;

      return (
        <StudentFirst
          navigation={navigation}
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  StudentApp: {
    screen: StudentApp,
    navigationOptions: { 
      header: null,
    },
  },


  TeacherApp: {
    screen: TeacherApp,
    navigationOptions: { 
      header: null,
    },
  },

  
}, { initialRouteName: 'Splash' });


const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
