/* eslint react/prop-types: 0 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Explore from './screens/Explore';
// import Launch from './screens/Launch';
import Games from './screens/Games';
import QuizMaker from './screens/QuizMaker';
import Reports from './screens/Reports';
import TabBarComponent from '../components/TabBarComponent';
import { colors } from '../utils/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';


const TeacherTabNavigator = createBottomTabNavigator({


  Explore: {
    screen: (props) => {
      const { screenProps } = props;

      return (
        <Explore {...screenProps} />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Explore',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'search'} tintColor={tintColor} label={'Explore'} />,
    },
  },


  // Launch: {
  //   screen: (props) => {
  //     const { screenProps } = props;

  //     return (
  //       <Launch {...screenProps} />
  //     );
  //   },
  //   navigationOptions: {
  //     tabBarLabel: 'Launch',
  //     tabBarIcon: ({ tintColor }) => (
  //       <TabBarComponent icon={'tablet'} tintColor={tintColor} label={'Launch'} />
  //     ),
  //   },
  // },


  Games: {
    screen: (props) => {
      const { navigation, screenProps } = props;

      return (
        <Games navigation={navigation} {...screenProps} />
      );
    },
    navigationOptions: {
      tabBarLabel: 'My Games',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'database'} tintColor={tintColor} label={'My Games'} />,
    },
  },


  QuizMaker: {
    screen: (props) => {
      const { screenProps } = props;

      return (
        <QuizMaker {...screenProps} />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Quiz Maker',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'puzzle-piece'} tintColor={tintColor} label={'Quiz Maker'} />,
    },
  },


  Reports: {
    screen: (props) => {
      const { screenProps } = props;

      return (
        <Reports {...screenProps} />
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
    iconStyle: {
      padding: 0,
    },
    labelStyle: {
      fontSize: moderateScale(12, 0.2),
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
      height: verticalScale(55),
    },
    swipeEnabled: false,
  },
});


class TeacherApp extends React.Component {
  static router = TeacherTabNavigator.router;

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    const { navigation, screenProps } = this.props;

    return (
      <TeacherTabNavigator
        navigation={navigation}
        screenProps={{ ...this.props, ...screenProps }}
      />
    );
  }
}


export default TeacherApp;
