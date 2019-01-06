/* eslint react/prop-types: 0 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Explore from './screens/Explore';
import Create from './screens/Create';
import Games from './screens/Games';
import Maker from './screens/Maker';
import Reports from './screens/Reports';
import TabBarComponent from '../components/TabBarComponent';
import { colors } from '../utils/theme';


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


  Create: {
    screen: (props) => {
      const { screenProps } = props;

      return (
        <Create {...screenProps} />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Create',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'tablet'} tintColor={tintColor} label={'Create'} />
    },
  },


  Games: {
    screen: (props) => {
      const { screenProps } = props;

      return (
        <Games {...screenProps} />
      );
    },
    navigationOptions: {
      tabBarLabel: 'My Games',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'database'} tintColor={tintColor} label={'My Games'} />,
    },
  },


  Maker: {
    screen: (props) => {
      const { screenProps } = props;

      return (
        <Maker {...screenProps} />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Maker',
      tabBarIcon: ({ tintColor }) => <TabBarComponent icon={'puzzle-piece'} tintColor={tintColor} label={'Maker'} />,
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
