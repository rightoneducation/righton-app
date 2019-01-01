/* eslint react/prop-types: 0 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Explore from './screens/Explore';
import Create from './screens/Create';
import Quizzes from './screens/Quizzes';
import Maker from './screens/Maker';
import Reports from './screens/Reports';
import TabBarComponent from '../components/TabBarComponent';
import { colors } from '../utils/theme';


const TeacherApp = createBottomTabNavigator({


  Explore: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Explore
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Explore',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'search'} tintColor={tintColor} label={'Explore'} />,
    },
  },


  Create: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Create
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Create',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'tablet'} tintColor={tintColor} label={'Create'} />
    },
  },


  Quizzes: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Quizzes
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Quizzes',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'database'} tintColor={tintColor} label={'Quizzes'} />,
    },
  },


  Maker: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Maker
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Maker',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'puzzle-piece'} tintColor={tintColor} label={'Maker'} />,
    },
  },


  Reports: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Reports
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Reports',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'bar-chart'} tintColor={tintColor} label={'Reports'} />
    },
  },


}, {
  animationEnabled: true,
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
    swipeEnabled: false,
  },
});


export default TeacherApp;
