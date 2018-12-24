import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';
import { colors } from '../../../utils/theme';

const styles = StyleSheet.create({
  tabBarIconContainer: { alignItems: 'center' },
  tabBarIcon: { fontSize: 15 },
});


const TabBarIcon = ({ icon, label, tintColor }) => (
  <View style={styles.tabBarIconContainer}>
    <Aicon type={'font-awesome'} name={icon} style={styles.tabBarIcon} color={tintColor} />
    {Platform.OS === 'ios' && <Text style={{ color: tintColor }}>{ label }</Text>}
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
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign In',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'sign-in'} tintColor={tintColor} label={'SIGN IN'} />,
    },
  },


  SignUp: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <SignUp
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Sign Up',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'sign-out'} tintColor={tintColor} label={'SIGN UP'} />
    },
  },


}, {
  initialRouteName: 'SignIn',
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
  icon: PropTypes.string,
  label: PropTypes.string,
  tintColor: PropTypes.string,
};

TabBarIcon.defaultProps = {
  icon: '',
  label: '',
  tintColor: '#000',
};


export default TeacherFirst;
