import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import Dashboard from './screens/Dashboard';


const StudentApp = DrawerNavigator({


  Dashboard: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <Dashboard 
          {...screenProps}
          {...otherProps}
          onCancel={() => otherProps.navigation.goBack()}
          onSuccess={() => otherProps.navigation.goBack()}
          studentAppNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      drawerLabel: ' ',
    },
  },


}, { header: null });

export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <StudentApp screenProps={{ ...screenProps, ...otherProps }} />;
};
