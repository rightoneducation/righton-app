import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';
import { colors } from '../../../utils/theme';

const styles = StyleSheet.create({
  tabBarLabel: { marginLeft: 9 },
  tabBarIconContainer: { flexDirection: 'row', alignItems: 'center', height: 30, paddingVertical: 35, },
});


const TabBarIcon = ({ label, tintColor }) => (
  <View style={styles.tabBarIconContainer}>
    <Aicon type={'font-awesome'} name={label === 'SIGN IN' ? 'sign-in' : 'sign-out'} style={styles.tabBarIcon} color={tintColor} />
    {Platform.OS === 'ios' && <Text style={[styles.tabBarLabel, { color: tintColor }]}>{ label }</Text>}
  </View>
);

const TeacherFirst = createBottomTabNavigator({


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
      tabBarIcon: ({ tintColor }) => <TabBarIcon tintColor={tintColor} label={'SIGN IN'} />,
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
      tabBarIcon: ({ tintColor }) => <TabBarIcon tintColor={tintColor} label={'SIGN UP'} />
    },
  },


}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: colors.white,
    inactiveTintColor: colors.dark,
    tabStyle: { backgroundColor: colors.primary, borderTopWidth: 0.5, borderTopColor: '#ededed' },
    showIcon: true,
    showLabel: Platform.OS !== 'ios',
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


const TeacherFirstContainer = createAppContainer(TeacherFirst);


export default (props) => {
  const { screenProps, ...otherProps } = props;
  return <TeacherFirstContainer screenProps={{ ...screenProps, ...otherProps }} />;
};
