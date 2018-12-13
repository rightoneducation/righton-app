import React from 'react';
import { StackNavigator } from 'react-navigation';
import Age from '../../components/Age';
import GameRoom from '../../components/GameRoom';
// import GameName from '../../components/GameName';


const StudentFirst = StackNavigator({



  Age: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <Age 
          {...screenProps}
          {...otherProps}
          onCancel={() => otherProps.navigation.goBack()}
          onSuccess={() => otherProps.navigation.goBack()}
          studentFirstNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },



  GameRoom: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <GameRoom
          { ...screenProps }
          { ...otherProps }
          studentFirstNavigator={navigation}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },



  // SignUp: {
  //   screen: (props) => {
  //     const { screenProps, ...otherProps } = props;

  //     return (
  //       <SignUp
  //         { ...screenProps }
  //         { ...otherProps }
  //         studentFirstNavigator={navigation}
  //         onSignUp={() => otherProps.navigation.navigate('LogIn')}
  //       />
  //     )
  //   },
  //   navigationOptions: {
  //     header: null,
  //   },
  // },



}, { header: null });

export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <StudentFirst screenProps={{ ...screenProps, ...otherProps }} />
};