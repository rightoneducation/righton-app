import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import GamePreview from '../GamePreview';
import GameTricks from '../GameTricks';


const GameApp = createBottomTabNavigator(
  {
    Default: { 
      screen: props => (
        <GamePreview screenProps={{ ...props.screenProps }} GameAppNavigator={props.navigation} />
      ),
      navigationOptions: {
        tabBarVisible: false,
      },
    },
    GameTricks: { 
      screen: props => (
        <GameTricks screenProps={{ ...props.screenProps }} GameAppNavigator={props.navigation} />
      ),
      navigationOptions: {
        tabBarVisible: false,
      },
    },
  }
);


const GameAppContainer = createAppContainer(GameApp);


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <GameAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
