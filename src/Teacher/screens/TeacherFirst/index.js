import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';
import { colors } from '../../../utils/theme';

const styles = StyleSheet.create({
  tabBarLabel: { marginLeft: 9 },
  tabBarIconContainer: { flexDirection: 'row', alignItems: 'center', height: 30 },
});


const TabBarIcon = ({ label, tintColor }) => (
  <View style={styles.tabBarIconContainer}>
    <Aicon type={'font-awesome'} name="sign-in" style={styles.tabBarIcon} color={tintColor} />
    {Platform.OS === 'ios' && <Text style={[styles.tabBarLabel, { color: tintColor }]}>{ label }</Text>}
  </View>
);

const FirstScreen = TabNavigator({


  SignIn: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <SignIn
          {...screenProps}
          {...otherProps}
          onLogIn={screenProps.onLogIn}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign In',
      tabBarIcon: <TabBarIcon tintColor={colors.white} label={'SIGN IN'} />,
    },
  },


  SignUp: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <SignUp
          {...screenProps}
          {...otherProps}
          onSignUp={screenProps.onSignUp}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign Up',
      tabBarIcon: <TabBarIcon tintColor={colors.white} label={'SIGN UP'} />
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


TabBarIcon.propTypes = {
  label: PropTypes.string,
  tintColor: PropTypes.string,
};

TabBarIcon.defaultProps = {
  label: '',
  tintColor: '#000',
};


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <FirstScreen screenProps={{ ...screenProps, ...otherProps }} />;
};
