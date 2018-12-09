import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import debug from '../../utils/debug';

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
      }, 3000));
    } catch (exception) {
      debug.log('Rejected session from Splash:', exception);
    }

    const loggedIn = session && session.isValid();

    this.setState({ isLoading: false });

    this._navigateTo(loggedIn ? 'Home' : 'OnboardIntroSlides');
  }



  _navigateTo(routeName) {
    this.props.navigation.navigate(routeName);
  }



  render() {
    return (
      this.state.isLoading &&
      <View style={styles.container}>
        <Text style={styles.logo}>Right On!</Text>
      </View>
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
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    color: '#000',    
    fontSize: 35,
    fontStyle: 'italic',
  },
});

export default Splash;