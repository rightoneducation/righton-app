import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import Dashboard from './screens/Dashboard';
import GamePreview from './screens/GamePreview';
import GameTricks from './screens/GameTricks';

const StudentSwitchNavigator = createSwitchNavigator({


  Dashboard: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <Dashboard 
          {...screenProps}
          {...otherProps}
          navigation={navigation}
        />
      );
    },
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
      <StudentSwitchNavigator navigation={navigation} screenProps={{ ...screenProps }} />
    );
  }
}


export default StudentApp;
