import React from 'react';
import PropTypes from 'prop-types';
import Portal from '../Portal';
import debug from '../../utils/debug';


export default class Splash extends React.Component {
  static propTypes = {
    deviceSettings: PropTypes.shape({
      role: PropTypes.string,
    }),
    navigation: PropTypes.shape({ type: PropTypes.func }),
    session: PropTypes.shape({ type: PropTypes.string }),
  }
  
  static defaultProps = {
    deviceSettings: {
      role: '',
    },
    navigation: {},
    session: {},
  }

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }


  async componentDidMount() {
    let session = {};
    try {
      await new Promise(async (resolve, reject) => setTimeout(() => {
        session = this.props.session;
        if (!session) {
          reject('No current session');
          return;
        }

        resolve();
      }, 2000));
    } catch (exception) {
      debug.log('Rejected session from Splash:', exception);
    }

    const loggedIn = session && session.isValid && session.isValid();

    this.setLoading();

    debug.log('User session:', JSON.stringify(session));

    if (__DEV__) {
      this.navigateTo('OnboardAppRouter');
      return;
    }

    if (loggedIn) {
      if (this.props.deviceSettings.role === 'teacher') {
        this.navigateTo('TeacherApp');
      } else {
        this.navigateTo('StudentApp');
      }
    } else if (this.props.deviceSettings.role === 'teacher') {
      this.navigateTo('OnboardAccount');
    } else if (this.props.deviceSettings.role === 'student') {
      this.navigateTo('StudentFirst');
    } else {
      this.navigateTo('OnboardAppRouter');
    }
  }


  setLoading() {
    this.setState({ isLoading: false });
  }


  navigateTo(routeName) {
    this.props.navigation.navigate(routeName);
  }


  render() {
    return (
      this.state.isLoading &&
      <Portal
        messageType={'single'}
        messageValues={{ message: 'RightOn!' }}
      />
    );
  }
}
