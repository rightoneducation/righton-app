import React from 'react';
import { Text, View, Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';
import { colors } from '../../../utils/theme';


const FirstScreen = TabNavigator({
  LogIn: {
    screen: (props) => {
      const { screenProps, navigation, ...otherProps } = props;

      return (
        <SignIn
          { ...screenProps }
          { ...otherProps }
          onLogIn={() => screenProps.rootNavigator.navigate('Home')}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign In',
      tabBarIcon: ({ tintColor }) => (
        <View style={styles.tabBarIconContainer}>
          <Aicon type='font-awesome' name="sign-in" style={styles.tabBarIcon} color={tintColor} />
          {Platform.OS === 'ios' && <Text style={[styles.tabBarLabel, { color: tintColor }]}>SIGN IN</Text>}
        </View>
      ),
    },
  },
  SignUp: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <SignUp
          { ...screenProps }
          { ...otherProps }
          onSignUp={() => otherProps.navigation.navigate('LogIn')}
        />
      )
    },
    navigationOptions: {
      tabBarLabel: 'Sign Up',
      tabBarIcon: ({ tintColor }) => (
        <View style={styles.tabBarIconContainer}>
          <Aicon type='font-awesome' name="pencil-square-o" style={styles.tabBarIcon} color={tintColor} />
          {Platform.OS === 'ios' && <Text style={[styles.tabBarLabel, { color: tintColor }]}>SIGN UP</Text>}
        </View>
      )
    },
  },
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      tabStyle: { borderTopWidth: 0.5, borderTopColor: '#ededed' },
      showIcon: true,
      showLabel: Platform.OS !== 'ios',
      activeTintColor: colors.white,
    },
  });

export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <FirstScreen screenProps={{ ...screenProps, ...otherProps }} />
};
