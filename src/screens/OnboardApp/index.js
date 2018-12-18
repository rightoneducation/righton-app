import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import OnboardAppRouter from '../OnboardAppRouter';
import OnboardTeacherRouter from '../OnboardTeacherRouter';
import TeacherFirst from '../../Teacher/screens/TeacherFirst';
import StudentFirst from '../../Student/screens/StudentFirst';


const OnboardApp = createStackNavigator({


  OnboardAppRouter: {
    screen: (props) => {
      const { navigation } = props;

      return (
        <OnboardAppRouter
          onboardNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  OnboardTeacherRouter: {
    screen: (props) => {
      const { navigation, screenProps } = props;

      return (
        <OnboardTeacherRouter
          onboardNavigator={navigation}
          rootNavigator={screenProps.rootNavigator}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  TeacherFirst: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <TeacherFirst
          {...screenProps}
          {...otherProps}
          onLogIn={() => screenProps.rootNavigator.navigate('TeacherApp')}
          onSignUp={() => screenProps.rootNavigator.navigate('TeacherApp')}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  StudentFirst: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <StudentFirst
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


}, { header: null });

const OnboardAppContainer = createAppContainer(OnboardApp);

export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <OnboardAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
