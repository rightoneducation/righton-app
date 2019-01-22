import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import Dashboard from './screens/Dashboard';
import GamePreview from './screens/GamePreview';
import GameQuiz from './screens/GameQuiz';
import GameReasons from './screens/GameReasons';
import GameFinal from './screens/GameFinal';
import StudentProfile from './screens/StudentProfile';


const StudentSwitchNavigator = createSwitchNavigator({


  Dashboard: {
    screen: props => (
      <Dashboard {...props} />
    ),
    navigationOptions: {

    },
  },


  StudentProfile: {
    screen: props => (
      <StudentProfile {...props} />
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


  GameQuiz: {
    screen: props => (
      <GameQuiz screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {

    },
  },


  GameReasons: {
    screen: props => (
      <GameReasons screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {

    },
  },


  GameFinal: {
    screen: props => (
      <GameFinal screenProps={{ ...props.screenProps }} navigation={props.navigation} />
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
