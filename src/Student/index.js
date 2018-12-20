import React from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Dashboard from './screens/Dashboard';
import GameApp from './screens/GameApp';


const StudentApp = createDrawerNavigator({


  Dashboard: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <Dashboard 
          {...screenProps}
          {...otherProps}
          studentAppNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      drawerLabel: 'Dashboard',
    },
  },


  GameApp: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <GameApp 
          {...screenProps}
          {...otherProps}
          studentAppNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      drawerLabel: ' ',
    },
  },


}, { header: null });


const StudentAppContainer = createAppContainer(StudentApp);


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <StudentAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
