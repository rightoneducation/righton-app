import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from 'react-navigation';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Explore from './screens/Explore';
import Create from './screens/Create';
import Quizzes from './screens/Quizzes';
import Maker from './screens/Maker';
import Reports from './screens/Reports';
import { colors } from '../utils/theme';

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

const TeacherApp = createBottomTabNavigator({


  Explore: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Explore
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Explore',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'search'} tintColor={tintColor} label={'Explore'} />,
    },
  },


  Create: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Create
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Create',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'tablet'} tintColor={tintColor} label={'Create'} />
    },
  },


  Quizzes: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Quizzes
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Quizzes',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'database'} tintColor={tintColor} label={'Quizzes'} />,
    },
  },


  Maker: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Maker
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Maker',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'puzzle-piece'} tintColor={tintColor} label={'Maker'} />,
    },
  },


  Reports: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return (
        <Reports
          {...screenProps}
          {...otherProps}
        />
      );
    },
    navigationOptions: {
      tabBarLabel: 'Reports',
      tabBarIcon: ({ tintColor }) => <TabBarIcon icon={'bar-chart'} tintColor={tintColor} label={'Reports'} />
    },
  },


}, {
  animationEnabled: true,
  swipeEnabled: false,
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


export default TeacherApp;
