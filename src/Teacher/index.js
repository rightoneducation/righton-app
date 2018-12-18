import React from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Dashboard from '../Student/screens/Dashboard';


const TeacherApp = createDrawerNavigator({


  Dashboard: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <Dashboard 
          {...screenProps}
          {...otherProps}
          onCancel={() => otherProps.navigation.goBack()}
          onSuccess={() => otherProps.navigation.goBack()}
          TeacherAppNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      drawerLabel: ' ',
    },
  },


}, { header: null });


const TeacherAppContainer = createAppContainer(TeacherApp);


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <TeacherAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
