import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Dashboard from './screens/Dashboard';
// import GameApp from './screens/GameApp';
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
          // studentAppNavigator={navigation}
          navigation={navigation}
        />
      );
    },
    navigationOptions: {
      // drawerLabel: 'Dashboard',
    },
  },


  // GameApp: {
  //   screen: (props) => {
  //     const { screenProps, navigation, ...otherProps } = props;

  //     return (
  //       <GameApp 
  //         {...screenProps}
  //         {...otherProps}
  //         studentAppNavigator={navigation}
  //       />
  //     );
  //   },
  //   navigationOptions: {
  //     drawerLabel: ' ',
  //   },
  // },


  GamePreview: {
    screen: props => (
      <GamePreview screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {
      // tabBarVisible: false,
    },
  },


  GameTricks: {
    screen: props => (
      <GameTricks screenProps={{ ...props.screenProps }} navigation={props.navigation} />
    ),
    navigationOptions: {
      // tabBarVisible: false,
    },
  },


}, { header: null });


const StudentAppContainer = createAppContainer(StudentSwitchNavigator);


class StudentApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {
    const { screenProps, ...otherProps } = this.props;

    return (
      <StudentAppContainer screenProps={{ ...screenProps, ...otherProps }} />
    );
  }
}


export default StudentApp;


// export default (props) => {
//   const { screenProps, ...otherProps } = props;
//   return <StudentAppContainer screenProps={{ ...screenProps, ...otherProps }} />;
// };
