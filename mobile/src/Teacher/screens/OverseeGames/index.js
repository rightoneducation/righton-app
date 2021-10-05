import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import GameDetails from "../Explore/GameDetails"
import PhaseInformation from "./PhaseInformation"
import Questions from './Questions'

const OverseeGames = () => {
  const OverseeGamesStack = createStackNavigator();

  return (
    <OverseeGamesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OverseeGamesStack.Screen name="GameDetails" component={GameDetails} />
      <OverseeGamesStack.Screen
        name="PhaseInformation"
        component={PhaseInformation}
      />
      <OverseeGamesStack.Screen name="Questions" component={Questions} />
    </OverseeGamesStack.Navigator>
  );
};

export default OverseeGames;
