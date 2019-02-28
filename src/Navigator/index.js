import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Splash from '../screens/Splash';
import OnboardAppRouter from '../screens/OnboardAppRouter';
import OnboardTeacherRouter from '../screens/OnboardTeacherRouter';
import StudentFirst from '../Student/screens/StudentFirst';
import OnboardAccount from '../screens/OnboardAccount';
import StudentApp from '../Student';
import TeacherApp from '../Teacher';
import TeacherGameRoom from '../Teacher/screens/GameRoom';
import TeacherProfile from '../Teacher/screens/TeacherProfile';

const RootNavigator = createSwitchNavigator({


  Splash: {
    screen: props => (
      <Splash navigation={props.navigation} {...props.screenProps} />
    ),
    navigationOptions: {
      header: null,
    },
  },


  /**
   * A duo account type front facing screen directly after the Splash screen
   * that displays if the user has not accessed the application before.
   * 
   * Helps navigate teacher/student into their respective application interfaces
   * and sets the deviceSettings for future streamlined access.
   */
  OnboardAppRouter: {
    screen: props => (
      <OnboardAppRouter
        navigation={props.navigation}
        screenProps={{
          handleSetAppState: props.screenProps.handleSetAppState,
        }}
      />
    ),
    navigationOptions: {
      header: null,
    },
  },


  /**
   * A screen for specifically onboarding teachers with slides to educate
   * them about RightOn and also to provide options for login/signup/maybe later.
   */
  OnboardTeacherRouter: {
    screen: (props) => {
      const { navigation, screenProps } = props;

      return (
        <OnboardTeacherRouter
          navigation={navigation}
          screenProps={{
            handleSetAppState: screenProps.handleSetAppState,
          }}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  /**
   * A duo account type onboarding TabNavigator for login/signup.
   * Serves creating both teacher and student accounts.
   */
  OnboardAccount: {
    screen: OnboardAccount,
    navigationOptions: {
      header: null,
    },
  },


  /**
   * A fast-tracked student game joining shell to immediately route
   * students into a game if one is being hosted by the teacher.
   */
  StudentFirst: {
    screen: (props) => {
      const { navigation, screenProps } = props;

      return (
        <StudentFirst
          navigation={navigation}
          screenProps={{
            handleSetAppState: screenProps.handleSetAppState,
            IOTUnsubscribeFromTopic: screenProps.IOTUnsubscribeFromTopic,
            IOTSubscribeToTopic: screenProps.IOTSubscribeToTopic,
          }}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },

  /**
   * The main student application screen which encapsulates the GameRoom screens
   * for the student RightOn experience. 
   */
  StudentApp: {
    screen: StudentApp,
    navigationOptions: { 
      header: null,
    },
  },


  /**
   * The TabNavigation experience of the Teacher for view/creating/launching games
   * and access to QuizMaker and Reports.
   */
  TeacherApp: {
    screen: TeacherApp,
    navigationOptions: { 
      header: null,
    },
  },


  /**
   * Separate GameRoom screen which switches between rendering the various game
   * screens for the teacher RightOn experience.
   */
  TeacherGameRoom: {
    screen: (props) => {
      const { navigation, screenProps } = props;
      return (
        <TeacherGameRoom
          screenProps={{
            account: screenProps.account,
            GameRoomID: screenProps.GameRoomID,
            gameState: screenProps.gameState,
            handleSetAppState: screenProps.handleSetAppState,
            IOTPublishMessage: screenProps.IOTPublishMessage,
            IOTUnsubscribeFromTopic: screenProps.IOTUnsubscribeFromTopic,
            navigation,
            players: screenProps.players,
          }}
        />
      );
    },
    navigationOptions: {
      header: null,
    },
  },


  /**
   * A separated screen for accessing teacher profile/account settings.
   */
  TeacherProfile: {
    screen: (props) => {
      const { navigation, screenProps } = props;
      return (
        <TeacherProfile
          navigation={navigation}
          screenProps={{
            account: screenProps.account,
            doSignOut: screenProps.doSignOut,
            handleSetAppState: screenProps.handleSetAppState,
          }}
        />
      );
    },
    navigationOptions: { 
      header: null,
    },
  },

  
}, { initialRouteName: 'Splash' });


const AppContainer = createAppContainer(RootNavigator);

export default AppContainer;
