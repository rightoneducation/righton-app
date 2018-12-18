import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
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


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <GameApp screenProps={{ ...screenProps, ...otherProps }} />;
};
