import React from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Dashboard from './screens/Dashboard';


const StudentApp = createDrawerNavigator({


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


const StudentAppContainer = createAppContainer(StudentApp);


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <StudentAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
