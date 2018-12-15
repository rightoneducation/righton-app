import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Portal from '../Portal';
import debug from '../../utils/debug';
import { colors } from '../../utils/theme';

class Splash extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }



  async componentDidMount() {
    const { session } = this.props;

    try {
      await new Promise(async (resolve, reject) => setTimeout(() => {
        if (!session) {
          reject('No current session');
          return;
        }

        resolve();
      }, __DEV__ ? 1500 : 2000));
    } catch (exception) {
      debug.log('Rejected session from Splash:', exception);
    }

    // debug.log(JSON.stringify(session));
    const loggedIn = session && session.isValid && session.isValid();

    this.setState({ isLoading: false });

    if (__DEV__) {
      this._navigateTo('OnboardApp');
      return;
    }

    // TODO Check whether app is signed up for Teacher or Student and route accordingly
    this._navigateTo(loggedIn ? 'TeacherApp' : 'OnboardApp');
  }



  _navigateTo(routeName) {
    this.props.navigation.navigate(routeName);
  }



  render() {
    return (
      this.state.isLoading &&
      <Portal
        messageType={'single'}
        messageValues={{message: 'RightOn!'}}
      />
    );
  }
}

Splash.propTypes = {
  navigation: PropTypes.object.isRequired,
  session: PropTypes.object,
};

Splash.defaultProps = {
  navigation: {},
  session: {},
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    color: colors.white,    
    fontSize: 35,
    fontStyle: 'italic',
  },
});

export default Splash;