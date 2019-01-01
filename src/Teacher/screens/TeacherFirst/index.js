/* eslint react/prop-types: 0 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';
import TabBarComponent from '../../../components/TabBarComponent';
import { colors } from '../../../utils/theme';

const TeacherFirst = createBottomTabNavigator({


  SignIn: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <SignIn
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign In',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'sign-in'} tintColor={tintColor} label={'Sign In'} />,
    },
  },


  SignUp: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <SignUp
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign Up',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'sign-out'} tintColor={tintColor} label={'Sign Up'} />
    },
  },


}, {
  animationEnabled: true,
  initialRouteName: 'SignIn',
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: colors.white,
    inactiveTintColor: colors.dark,
    labelStyle: {
      fontSize: 10,
      margin: 0,
      padding: 0,
    },
    tabStyle: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderTopWidth: 0.5,
      borderTopColor: '#ededed',
      flex: 1,
    },
    showIcon: true,
    showLabel: Platform.OS !== 'ios',
    style: {
      justifyContent: 'center',
    },
  },
});

export default TeacherFirst;
