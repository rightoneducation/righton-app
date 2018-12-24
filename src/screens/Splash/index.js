import React from 'react';
import PropTypes from 'prop-types';
import Portal from '../Portal';
import debug from '../../utils/debug';


export default class Splash extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({ type: PropTypes.func }),
    session: PropTypes.shape({ type: PropTypes.string }),
  }
  
  static defaultProps = {
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
    const { session } = this.props;

    try {
      await new Promise(async (resolve, reject) => setTimeout(() => {
        if (!session) {
          reject('No current session');
          return;
        }

        resolve();
      }, __DEV__ ? 500 : 2000));
    } catch (exception) {
      debug.log('Rejected session from Splash:', exception);
    }

    // debug.log(JSON.stringify(session));
    const loggedIn = session && session.isValid && session.isValid();

    this.setLoading();

    if (__DEV__) {
      this.navigateTo('OnboardAppRouter');
      return;
    }

    // TODO Check whether app is signed up for Teacher or Student and route accordingly
    this.navigateTo(loggedIn ? 'TeacherApp' : 'OnboardApp');
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
