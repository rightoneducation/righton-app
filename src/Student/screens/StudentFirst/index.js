import React from 'react';
import { StackNavigator } from 'react-navigation';
import Age from '../../components/Age';
import GameRoom from './StudentFirstGameRoom';


const StudentFirst = StackNavigator({


  Age: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <Age 
          {...screenProps}
          {...otherProps}
          rootNavigator={screenProps.navigation}
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
          {...screenProps}
          {...otherProps}
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
  return <StudentFirst screenProps={{ ...screenProps, ...otherProps }} />;
};
