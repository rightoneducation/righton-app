import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import GamePreview from '../GamePreview';


const GameApp = createBottomTabNavigator(
  {
    Default: { 
      screen: GamePreview,
      navigationOptions: {
        tabBarVisible: false,
      },
    }
  }
);


const GameAppContainer = createAppContainer(GameApp);


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <GameAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
