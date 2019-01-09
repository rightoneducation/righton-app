import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import Dashboard from './screens/Dashboard';
import GamePreview from './screens/GamePreview';
import GameTricks from './screens/GameTricks';
import GameQuiz from './screens/GameQuiz';

const StudentSwitchNavigator = createSwitchNavigator({


  Dashboard: {
    screen: props => (
      <Dashboard {...props} />
    ),
    navigationOptions: {

    },
  },


  GamePreview: {
    screen: props => (
      <GamePreview screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {

    },
  },


  GameTricks: {
    screen: props => (
      <GameTricks screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {

    },
  },


  GameQuiz: {
    screen: props => (
      <GameQuiz screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {

    },
  },


}, { header: null });


class StudentApp extends React.Component {
  static router = StudentSwitchNavigator.router;

  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    const { navigation, screenProps } = this.props;

    return (
      <StudentSwitchNavigator
        navigation={navigation}
        screenProps={{ ...this.props, ...screenProps }}
      />
    );
  }
}


export default StudentApp;
