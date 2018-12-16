import React from 'react';
import { StackNavigator } from 'react-navigation';
import OnboardAppRouter from '../OnboardAppRouter';
import TeacherFirst from '../../Teacher/screens/TeacherFirst';
import StudentFirst from '../../Student/screens/StudentFirst';


const OnboardApp = StackNavigator({


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


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <OnboardApp screenProps={{ ...screenProps, ...otherProps }} />;
};
